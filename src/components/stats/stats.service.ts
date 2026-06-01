import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AdminStats,
  CampaignCounts,
  DeviceCounts,
  MemberStats,
  SmsCounts,
  SmsSeriesPoint,
} from '../../libs/dto/stats/stats';
import { CampaignStatus } from '../../libs/enums/campaign.enum';
import { DeviceStatus } from '../../libs/enums/device.enum';
import { MemberStatus } from '../../libs/enums/member.enum';
import { SubscriptionPlan, SubscriptionStatus } from '../../libs/enums/subscription.enum';
import { MODEL } from '../../libs/types/model-names';

const DEFAULT_DAYS = 14;

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(MODEL.MEMBER) private readonly memberModel: Model<any>,
    @InjectModel(MODEL.CAMPAIGN) private readonly campaignModel: Model<any>,
    @InjectModel(MODEL.DEVICE) private readonly deviceModel: Model<any>,
    @InjectModel(MODEL.SMS_LOG) private readonly smsLogModel: Model<any>,
    @InjectModel(MODEL.SUBSCRIPTION) private readonly subscriptionModel: Model<any>,
  ) {}

  async getMemberStats(memberId: string, days = DEFAULT_DAYS): Promise<MemberStats> {
    const oid = new Types.ObjectId(memberId);
    const [campaignRows, deviceRows, smsRow, smsSeries] = await Promise.all([
      this.groupCount(this.campaignModel, { memberId: oid }, '$status'),
      this.groupCount(this.deviceModel, { memberId: oid }, '$status'),
      this.smsTotals({ memberId: oid }),
      this.smsTimeSeries({ memberId: oid }, days),
    ]);

    return {
      campaigns: this.foldCampaigns(campaignRows),
      devices: this.foldDevices(deviceRows),
      sms: smsRow,
      smsSeries,
    };
  }

  async getAdminStats(days = DEFAULT_DAYS): Promise<AdminStats> {
    const [memberRows, campaignRows, devicesOnline, smsRow, planRows, statusRows, smsSeries] =
      await Promise.all([
        this.groupCount(this.memberModel, {}, '$memberStatus'),
        this.groupCount(this.campaignModel, {}, '$status'),
        this.deviceModel.countDocuments({ status: DeviceStatus.ONLINE }),
        this.smsTotals({}),
        this.groupCount(this.subscriptionModel, {}, '$plan'),
        this.groupCount(this.subscriptionModel, {}, '$status'),
        this.smsTimeSeries({}, days),
      ]);

    const members = this.toMap(memberRows);
    const plans = this.toMap(planRows);
    const subStatus = this.toMap(statusRows);

    return {
      members: {
        active: members[MemberStatus.ACTIVE] ?? 0,
        blocked: members[MemberStatus.BLOCKED] ?? 0,
        deleted: members[MemberStatus.DELETED] ?? 0,
        total: this.sum(members),
      },
      campaigns: this.foldCampaigns(campaignRows),
      devicesOnline,
      sms: smsRow,
      subscriptions: {
        byPlan: {
          BASIC: plans[SubscriptionPlan.BASIC] ?? 0,
          PRO: plans[SubscriptionPlan.PRO] ?? 0,
          ENTERPRISE: plans[SubscriptionPlan.ENTERPRISE] ?? 0,
        },
        byStatus: {
          ACTIVE: subStatus[SubscriptionStatus.ACTIVE] ?? 0,
          EXPIRED: subStatus[SubscriptionStatus.EXPIRED] ?? 0,
          CANCELLED: subStatus[SubscriptionStatus.CANCELLED] ?? 0,
        },
      },
      smsSeries,
    };
  }

  // ---- helpers ----

  private async groupCount(
    model: Model<any>,
    match: Record<string, unknown>,
    field: string,
  ): Promise<{ _id: string; count: number }[]> {
    return model.aggregate([
      { $match: match },
      { $group: { _id: field, count: { $sum: 1 } } },
    ]);
  }

  private toMap(rows: { _id: string; count: number }[]): Record<string, number> {
    return rows.reduce<Record<string, number>>((acc, r) => {
      if (r._id != null) acc[r._id] = r.count;
      return acc;
    }, {});
  }

  private sum(map: Record<string, number>): number {
    return Object.values(map).reduce((a, b) => a + b, 0);
  }

  private foldCampaigns(rows: { _id: string; count: number }[]): CampaignCounts {
    const m = this.toMap(rows);
    return {
      draft: m[CampaignStatus.DRAFT] ?? 0,
      scheduled: m[CampaignStatus.SCHEDULED] ?? 0,
      sending: m[CampaignStatus.SENDING] ?? 0,
      done: m[CampaignStatus.DONE] ?? 0,
      total: this.sum(m),
    };
  }

  private foldDevices(rows: { _id: string; count: number }[]): DeviceCounts {
    const m = this.toMap(rows);
    return {
      online: m[DeviceStatus.ONLINE] ?? 0,
      offline: m[DeviceStatus.OFFLINE] ?? 0,
      blocked: m[DeviceStatus.BLOCKED] ?? 0,
      total: this.sum(m),
    };
  }

  private async smsTotals(match: Record<string, unknown>): Promise<SmsCounts> {
    const rows = await this.groupCount(this.smsLogModel, match, '$status');
    const m = this.toMap(rows);
    return { sent: m.SENT ?? 0, failed: m.FAILED ?? 0, delivered: m.DELIVERED ?? 0 };
  }

  private async smsTimeSeries(
    match: Record<string, unknown>,
    days: number,
  ): Promise<SmsSeriesPoint[]> {
    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - (days - 1));

    const rows: { _id: string; sent: number; failed: number }[] = await this.smsLogModel.aggregate([
      { $match: { ...match, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sent: { $sum: { $cond: [{ $eq: ['$status', 'SENT'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] } },
        },
      },
    ]);

    const byDate = rows.reduce<Record<string, { sent: number; failed: number }>>((acc, r) => {
      acc[r._id] = { sent: r.sent, failed: r.failed };
      return acc;
    }, {});

    // Zero-fill every day in the window so the chart is continuous.
    const series: SmsSeriesPoint[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setUTCDate(since.getUTCDate() + i);
      const key = d.toISOString().slice(0, 10);
      series.push({ date: key, sent: byDate[key]?.sent ?? 0, failed: byDate[key]?.failed ?? 0 });
    }
    return series;
  }
}
