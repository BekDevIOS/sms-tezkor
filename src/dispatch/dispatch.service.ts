import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeviceJob } from '../libs/dto/device/device';
import { ReportResultInput } from '../libs/dto/device/device.input';
import { CampaignStatus } from '../libs/enums/campaign.enum';
import { CampaignRecipientStatus } from '../libs/enums/campaign-recipient.enum';
import { DeviceStatus } from '../libs/enums/device.enum';
import { SmsLogStatus } from '../libs/enums/sms-log.enum';
import { MODEL } from '../libs/types/model-names';

export const MAX_ATTEMPTS = 3;
/** Recipients stuck in PROCESSING longer than this are reclaimed. */
export const STUCK_PROCESSING_MS = 5 * 60 * 1000;

@Injectable()
export class DispatchService {
  private readonly logger = new Logger(DispatchService.name);

  constructor(
    @InjectModel(MODEL.CAMPAIGN) private readonly campaignModel: Model<any>,
    @InjectModel(MODEL.CAMPAIGN_RECIPIENT)
    private readonly recipientModel: Model<any>,
    @InjectModel(MODEL.DEVICE) private readonly deviceModel: Model<any>,
    @InjectModel(MODEL.MEMBER) private readonly memberModel: Model<any>,
    @InjectModel(MODEL.SMS_LOG) private readonly smsLogModel: Model<any>,
  ) {}

  /**
   * Idempotently start a campaign: assign its PENDING recipients to online
   * devices and flip status to SENDING. Safe to call from both the
   * "send now" path and the scheduler.
   */
  async activateCampaign(campaignId: string | Types.ObjectId): Promise<void> {
    const campaign = await this.campaignModel.findById(campaignId).lean();
    if (!campaign) return;
    if (
      campaign.status === CampaignStatus.DONE ||
      campaign.status === CampaignStatus.SENDING
    ) {
      // Already running/finished — still (re)assign in case devices appeared.
      await this.assignRecipients(campaign);
      await this.checkCampaignDone(campaign._id);
      return;
    }
    await this.campaignModel.updateOne(
      { _id: campaign._id },
      { $set: { status: CampaignStatus.SENDING } },
    );
    await this.assignRecipients({ ...campaign, status: CampaignStatus.SENDING });
    await this.checkCampaignDone(campaign._id);
  }

  /**
   * Distribute a campaign's unassigned PENDING recipients across the member's
   * ONLINE devices, balancing by current load. No-op when no devices are online
   * (recipients stay PENDING and are picked up on a later tick / device poll).
   */
  async assignRecipients(campaign: any): Promise<void> {
    const devices = await this.deviceModel
      .find({ memberId: campaign.memberId, status: DeviceStatus.ONLINE })
      .select('_id currentLoad')
      .lean();
    if (devices.length === 0) return;

    const pending = await this.recipientModel
      .find({
        campaignId: campaign._id,
        status: CampaignRecipientStatus.PENDING,
        assignedDeviceId: { $in: [null, undefined] },
      })
      .select('_id')
      .lean();
    if (pending.length === 0) return;

    // In-memory load tracking so we balance within this batch too.
    const loads = devices.map((d) => ({
      id: d._id,
      load: d.currentLoad ?? 0,
    }));
    const assignedCount: Record<string, number> = {};
    const ops: any[] = [];

    for (const recipient of pending) {
      loads.sort((a, b) => a.load - b.load);
      const target = loads[0];
      target.load += 1;
      const key = String(target.id);
      assignedCount[key] = (assignedCount[key] ?? 0) + 1;
      ops.push({
        updateOne: {
          filter: {
            _id: recipient._id,
            status: CampaignRecipientStatus.PENDING,
            assignedDeviceId: { $in: [null, undefined] },
          },
          update: { $set: { assignedDeviceId: target.id } },
        },
      });
    }

    if (ops.length) await this.recipientModel.bulkWrite(ops);
    const loadOps = Object.entries(assignedCount).map(([id, n]) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id) },
        update: { $inc: { currentLoad: n } },
      },
    }));
    if (loadOps.length) await this.deviceModel.bulkWrite(loadOps);
  }

  /**
   * Atomically claim jobs for a polling device. Lazily assigns unassigned
   * PENDING recipients of the member's SENDING campaigns to this device, then
   * claims its assigned PENDING recipients (PENDING -> PROCESSING).
   */
  async claimJobsForDevice(deviceId: string, limit?: number): Promise<DeviceJob[]> {
    const device = await this.deviceModel.findById(deviceId).lean();
    if (!device) return [];
    const cap = Math.min(Math.max(limit ?? device.sendLimitPerMinute ?? 60, 1), 500);

    // Fail recipients that have exhausted their attempts.
    await this.failExhausted(deviceId);

    // Lazily assign unassigned PENDING recipients of this member's running campaigns.
    const sendingCampaigns = await this.campaignModel
      .find({ memberId: device.memberId, status: CampaignStatus.SENDING })
      .select('_id')
      .lean();
    const campaignIds = sendingCampaigns.map((c) => c._id);
    if (campaignIds.length) {
      let lazyAssigned = 0;
      while (lazyAssigned < cap) {
        const r = await this.recipientModel.findOneAndUpdate(
          {
            campaignId: { $in: campaignIds },
            status: CampaignRecipientStatus.PENDING,
            assignedDeviceId: { $in: [null, undefined] },
            attempts: { $lt: MAX_ATTEMPTS },
          },
          { $set: { assignedDeviceId: device._id } },
        );
        if (!r) break;
        lazyAssigned += 1;
      }
      if (lazyAssigned > 0) {
        await this.deviceModel.updateOne(
          { _id: device._id },
          { $inc: { currentLoad: lazyAssigned } },
        );
      }
    }

    // Claim assigned PENDING recipients atomically.
    const claimed: any[] = [];
    while (claimed.length < cap) {
      const r = await this.recipientModel.findOneAndUpdate(
        {
          assignedDeviceId: device._id,
          status: CampaignRecipientStatus.PENDING,
          attempts: { $lt: MAX_ATTEMPTS },
        },
        {
          $set: { status: CampaignRecipientStatus.PROCESSING },
          $inc: { attempts: 1 },
        },
        { new: true },
      );
      if (!r) break;
      claimed.push(r);
    }
    if (claimed.length === 0) return [];

    // Attach the campaign message to each job.
    const ids = [...new Set(claimed.map((r) => String(r.campaignId)))];
    const campaigns = await this.campaignModel
      .find({ _id: { $in: ids } })
      .select('_id message')
      .lean();
    const messageById = new Map(campaigns.map((c) => [String(c._id), c.message]));

    return claimed.map((r) => ({
      recipientId: String(r._id),
      campaignId: String(r.campaignId),
      phone: r.phone,
      message: messageById.get(String(r.campaignId)) ?? '',
    }));
  }

  /** Record a device's send result for one recipient and update all counters. */
  async reportResult(deviceId: string, input: ReportResultInput): Promise<{ success: boolean }> {
    const isSent = input.status === SmsLogStatus.SENT;
    const recipient = await this.recipientModel.findOneAndUpdate(
      {
        _id: input.recipientId,
        assignedDeviceId: new Types.ObjectId(deviceId),
        status: CampaignRecipientStatus.PROCESSING,
      },
      {
        $set: {
          status: isSent ? CampaignRecipientStatus.SENT : CampaignRecipientStatus.FAILED,
          sentAt: isSent ? new Date() : undefined,
          failReason: isSent ? undefined : (input.failReason ?? 'send_failed'),
        },
      },
      { new: true },
    );
    // No match => already reported or not owned by this device. Idempotent no-op.
    if (!recipient) return { success: false };

    await this.finalizeCounters(
      recipient,
      deviceId,
      isSent ? SmsLogStatus.SENT : SmsLogStatus.FAILED,
      input.providerResponse,
    );
    await this.checkCampaignDone(recipient.campaignId);
    return { success: true };
  }

  /** Mark recipients that exhausted their attempts as FAILED, with counter updates. */
  private async failExhausted(deviceId: string): Promise<void> {
    while (true) {
      const recipient = await this.recipientModel.findOneAndUpdate(
        {
          assignedDeviceId: new Types.ObjectId(deviceId),
          status: CampaignRecipientStatus.PENDING,
          attempts: { $gte: MAX_ATTEMPTS },
        },
        {
          $set: {
            status: CampaignRecipientStatus.FAILED,
            failReason: 'max_attempts',
          },
        },
        { new: true },
      );
      if (!recipient) break;
      await this.finalizeCounters(recipient, deviceId, SmsLogStatus.FAILED);
      await this.checkCampaignDone(recipient.campaignId);
    }
  }

  /** Write the SmsLog and bump campaign/member/device counters for a terminal recipient. */
  private async finalizeCounters(
    recipient: any,
    deviceId: string,
    status: SmsLogStatus.SENT | SmsLogStatus.FAILED,
    providerResponse?: Record<string, unknown>,
  ): Promise<void> {
    const isSent = status === SmsLogStatus.SENT;
    const campaign = await this.campaignModel
      .findById(recipient.campaignId)
      .select('memberId message')
      .lean();

    await this.smsLogModel.create({
      memberId: campaign?.memberId,
      deviceId: new Types.ObjectId(deviceId),
      campaignId: recipient.campaignId,
      contactId: recipient.contactId,
      phone: recipient.phone,
      message: campaign?.message,
      status,
      providerResponse,
    });

    await this.campaignModel.updateOne(
      { _id: recipient.campaignId },
      { $inc: isSent ? { sentCount: 1 } : { failedCount: 1 } },
    );
    if (campaign?.memberId) {
      await this.memberModel.updateOne(
        { _id: campaign.memberId },
        { $inc: isSent ? { memberSentSms: 1 } : { memberFailedSms: 1 } },
      );
    }
    await this.deviceModel.updateOne(
      { _id: deviceId, currentLoad: { $gt: 0 } },
      { $inc: { currentLoad: -1 } },
    );
  }

  /** Flip a campaign to DONE once no recipients remain PENDING or PROCESSING. */
  async checkCampaignDone(campaignId: string | Types.ObjectId): Promise<void> {
    const remaining = await this.recipientModel.countDocuments({
      campaignId,
      status: {
        $in: [
          CampaignRecipientStatus.PENDING,
          CampaignRecipientStatus.PROCESSING,
        ],
      },
    });
    if (remaining === 0) {
      await this.campaignModel.updateOne(
        { _id: campaignId, status: CampaignStatus.SENDING },
        { $set: { status: CampaignStatus.DONE } },
      );
    }
  }

  /** Reclaim recipients stuck in PROCESSING (device died mid-send). */
  async resetStuckProcessing(): Promise<void> {
    const cutoff = new Date(Date.now() - STUCK_PROCESSING_MS);
    const stuck = await this.recipientModel
      .find({
        status: CampaignRecipientStatus.PROCESSING,
        updatedAt: { $lt: cutoff },
      })
      .select('_id assignedDeviceId')
      .lean();
    if (stuck.length === 0) return;

    await this.recipientModel.updateMany(
      { _id: { $in: stuck.map((s) => s._id) } },
      { $set: { status: CampaignRecipientStatus.PENDING } },
    );
    // Release the load held on the devices.
    const perDevice: Record<string, number> = {};
    for (const s of stuck) {
      if (!s.assignedDeviceId) continue;
      const key = String(s.assignedDeviceId);
      perDevice[key] = (perDevice[key] ?? 0) + 1;
    }
    const ops = Object.entries(perDevice).map(([id, n]) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id), currentLoad: { $gte: n } },
        update: { $inc: { currentLoad: -n } },
      },
    }));
    if (ops.length) await this.deviceModel.bulkWrite(ops);
    this.logger.warn(`Reset ${stuck.length} stuck recipient(s) to PENDING`);
  }
}
