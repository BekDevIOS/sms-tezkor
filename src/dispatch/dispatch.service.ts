import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeviceJob } from '../libs/dto/device/device';
import { ReportResultInput } from '../libs/dto/device/device.input';
import { CampaignStatus } from '../libs/enums/campaign.enum';
import { CampaignRecipientStatus } from '../libs/enums/campaign-recipient.enum';
import { DeviceStatus } from '../libs/enums/device.enum';
import { SmsLogStatus } from '../libs/enums/sms-log.enum';
import { SubscriptionStatus } from '../libs/enums/subscription.enum';
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
    @InjectModel(MODEL.SUBSCRIPTION) private readonly subscriptionModel: Model<any>,
    @InjectModel(MODEL.DAILY_SMS_USAGE) private readonly dailySmsUsageModel: Model<any>,
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
    const dailyLimit = await this.getDailyLimit(device.memberId);
    if (dailyLimit === 0) return [];

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
      let r = await this.recipientModel.findOneAndUpdate(
        {
          assignedDeviceId: device._id,
          status: CampaignRecipientStatus.PENDING,
          attempts: { $lt: MAX_ATTEMPTS },
          quotaReserved: true,
        },
        {
          $set: { status: CampaignRecipientStatus.PROCESSING },
          $inc: { attempts: 1 },
        },
        { new: true },
      );
      if (!r) {
        const reserved = await this.reserveDailyQuota(device.memberId, dailyLimit);
        if (!reserved) break;
        r = await this.recipientModel.findOneAndUpdate(
          {
            assignedDeviceId: device._id,
            status: CampaignRecipientStatus.PENDING,
            attempts: { $lt: MAX_ATTEMPTS },
            quotaReserved: { $ne: true },
          },
          {
            $set: { status: CampaignRecipientStatus.PROCESSING, quotaReserved: true },
            $inc: { attempts: 1 },
          },
          { new: true },
        );
        if (!r) {
          await this.releaseDailyQuota(device.memberId, dailyLimit);
          break;
        }
      }
      if (!r) break;
      claimed.push(r);
    }
    if (claimed.length === 0) return [];

    // Older recipients created before personalized snapshots fall back to the campaign body.
    const ids = [...new Set(claimed.filter((r) => !r.message).map((r) => String(r.campaignId)))];
    const campaigns = ids.length
      ? await this.campaignModel.find({ _id: { $in: ids } }).select('_id message').lean()
      : [];
    const messageById = new Map(campaigns.map((c) => [String(c._id), c.message]));

    return claimed.map((r) => ({
      recipientId: String(r._id),
      campaignId: String(r.campaignId),
      phone: r.phone,
      message: r.message ?? messageById.get(String(r.campaignId)) ?? '',
    }));
  }

  private async getDailyLimit(memberId: Types.ObjectId): Promise<number | null> {
    const now = new Date();
    const subscription = await this.subscriptionModel
      .findOne({
        memberId,
        status: SubscriptionStatus.ACTIVE,
        startsAt: { $lte: now },
        $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: now } }],
      })
      .sort({ createdAt: -1 })
      .select('dailySmsLimit')
      .lean();
    if (!subscription) return 0;
    return typeof subscription.dailySmsLimit === 'number' ? subscription.dailySmsLimit : null;
  }

  private uzbekistanDate(): string {
    return new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }

  private async reserveDailyQuota(memberId: Types.ObjectId, limit: number | null): Promise<boolean> {
    if (limit === null) return true;
    try {
      const usage = await this.dailySmsUsageModel.findOneAndUpdate(
        { memberId, date: this.uzbekistanDate(), claimedCount: { $lt: limit } },
        { $inc: { claimedCount: 1 }, $setOnInsert: { memberId, date: this.uzbekistanDate() } },
        { new: true, upsert: true },
      );
      return !!usage;
    } catch (err: any) {
      if (err?.code === 11000) return false;
      throw err;
    }
  }

  private async releaseDailyQuota(memberId: Types.ObjectId, limit: number | null): Promise<void> {
    if (limit === null) return;
    await this.dailySmsUsageModel.updateOne(
      { memberId, date: this.uzbekistanDate(), claimedCount: { $gt: 0 } },
      { $inc: { claimedCount: -1 } },
    );
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
      message: recipient.message ?? campaign?.message,
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

  /** Release queued jobs when a device is reset or revoked. In-flight jobs are not retried automatically. */
  async stopDeviceJobs(deviceId: string): Promise<void> {
    const deviceObjectId = new Types.ObjectId(deviceId);
    await this.recipientModel.updateMany(
      { assignedDeviceId: deviceObjectId, status: CampaignRecipientStatus.PENDING },
      { $unset: { assignedDeviceId: 1 } },
    );

    while (true) {
      const recipient = await this.recipientModel.findOneAndUpdate(
        { assignedDeviceId: deviceObjectId, status: CampaignRecipientStatus.PROCESSING },
        { $set: { status: CampaignRecipientStatus.FAILED, failReason: 'send_result_unknown' } },
        { new: true },
      );
      if (!recipient) break;
      await this.finalizeCounters(recipient, deviceId, SmsLogStatus.FAILED);
      await this.checkCampaignDone(recipient.campaignId);
    }
  }

  /**
   * Stop recipients stuck in PROCESSING. Their send outcome is unknown, so an
   * automatic retry could send a duplicate SMS. Operators may retry manually
   * after reviewing the device log.
   */
  async resetStuckProcessing(): Promise<void> {
    const cutoff = new Date(Date.now() - STUCK_PROCESSING_MS);
    const stuck = await this.recipientModel
      .find({
        status: CampaignRecipientStatus.PROCESSING,
        updatedAt: { $lt: cutoff },
      })
      .select('_id assignedDeviceId campaignId')
      .lean();
    if (stuck.length === 0) return;

    for (const s of stuck) {
      if (!s.assignedDeviceId) continue;
      const recipient = await this.recipientModel.findOneAndUpdate(
        { _id: s._id, status: CampaignRecipientStatus.PROCESSING },
        { $set: { status: CampaignRecipientStatus.FAILED, failReason: 'send_result_unknown' } },
        { new: true },
      );
      if (!recipient) continue;
      await this.finalizeCounters(recipient, String(s.assignedDeviceId), SmsLogStatus.FAILED);
      await this.checkCampaignDone(recipient.campaignId);
    }
    this.logger.warn(`Stopped ${stuck.length} recipient(s) with unknown send result`);
  }
}
