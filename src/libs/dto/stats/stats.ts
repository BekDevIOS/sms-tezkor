import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class StatsRangeQuery {
  /** Number of days for the SMS volume time-series. Default 14, max 90. */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(90)
  @Type(() => Number)
  days?: number;
}

export class CampaignCounts {
  draft: number;
  scheduled: number;
  sending: number;
  done: number;
  total: number;
}

export class DeviceCounts {
  online: number;
  offline: number;
  blocked: number;
  total: number;
}

export class SmsCounts {
  sent: number;
  failed: number;
  delivered: number;
}

export class SmsSeriesPoint {
  date: string; // YYYY-MM-DD
  sent: number;
  failed: number;
}

export class MemberStats {
  campaigns: CampaignCounts;
  devices: DeviceCounts;
  sms: SmsCounts;
  smsSeries: SmsSeriesPoint[];
}

export class MemberCounts {
  active: number;
  blocked: number;
  deleted: number;
  total: number;
}

export class SubscriptionBreakdown {
  byPlan: { BASIC: number; PRO: number; ENTERPRISE: number };
  byStatus: { ACTIVE: number; EXPIRED: number; CANCELLED: number };
}

export class AdminStats {
  members: MemberCounts;
  campaigns: CampaignCounts;
  devicesOnline: number;
  sms: SmsCounts;
  subscriptions: SubscriptionBreakdown;
  smsSeries: SmsSeriesPoint[];
}
