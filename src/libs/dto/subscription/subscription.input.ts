import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  SubscriptionPlan,
  SubscriptionStatus,
} from '../../enums/subscription.enum';

export class ActivateSubscriptionDto {
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  /** Subscription length in days. Omit for an open-ended (no expiry) subscription. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3650)
  durationDays?: number;

  /** Max devices the member may pair. Omit for unlimited. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  deviceLimit?: number;

  /** Max outbound SMS jobs allowed per Uzbekistan calendar day. Omit for unlimited. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  dailySmsLimit?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class SubscriptionsInquiry {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsInt()
  @Min(1)
  @Max(200)
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;
}
