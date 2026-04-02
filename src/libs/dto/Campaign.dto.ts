import { Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsDate,
	IsIn,
	IsInt,
	IsMongoId,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator';
import {
	CAMPAIGN_SENDER_MODE_VALUES,
	CAMPAIGN_STATUS_VALUES,
	CAMPAIGN_TYPE_VALUES,
	type CampaignSenderModeValue,
	type CampaignStatusValue,
	type CampaignTypeValue,
} from '../enums/Campaign.enum';

export class CampaignOptionsDto {
	@IsOptional()
	@IsBoolean()
	allowReplyTracking?: boolean;

	@IsOptional()
	@IsBoolean()
	useRandomDelay?: boolean;

	@IsOptional()
	@IsInt()
	@Min(0)
	minDelaySec?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	maxDelaySec?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	batchSize?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	batchPauseSec?: number;
}

export class CreateCampaignDto {
	@IsMongoId()
	userId!: string;

	@IsOptional()
	@IsArray()
	@IsMongoId({ each: true })
	deviceIds?: string[];

	@IsOptional()
	@IsIn(CAMPAIGN_TYPE_VALUES)
	campaignType?: CampaignTypeValue;

	@IsOptional()
	@IsIn(CAMPAIGN_STATUS_VALUES)
	campaignStatus?: CampaignStatusValue;

	@IsOptional()
	@IsIn(CAMPAIGN_SENDER_MODE_VALUES)
	campaignSenderMode?: CampaignSenderModeValue;

	@IsString()
	campaignTitle!: string;

	@IsString()
	campaignMessage!: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	campaignScheduledAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	campaignStartedAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	campaignCompletedAt?: Date;

	@IsOptional()
	@IsInt()
	@Min(0)
	campaignTotalRecipients?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	campaignSentCount?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	campaignFailedCount?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	campaignPendingCount?: number;

	@IsOptional()
	@ValidateNested()
	@Type(() => CampaignOptionsDto)
	campaignOptions?: CampaignOptionsDto;
}

export class UpdateCampaignDto {
	@IsOptional()
	@IsArray()
	@IsMongoId({ each: true })
	deviceIds?: string[];

	@IsOptional()
	@IsIn(CAMPAIGN_TYPE_VALUES)
	campaignType?: CampaignTypeValue;

	@IsOptional()
	@IsIn(CAMPAIGN_STATUS_VALUES)
	campaignStatus?: CampaignStatusValue;

	@IsOptional()
	@IsIn(CAMPAIGN_SENDER_MODE_VALUES)
	campaignSenderMode?: CampaignSenderModeValue;

	@IsOptional()
	@IsString()
	campaignTitle?: string;

	@IsOptional()
	@IsString()
	campaignMessage?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	campaignScheduledAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	campaignStartedAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	campaignCompletedAt?: Date;

	@IsOptional()
	@IsInt()
	@Min(0)
	campaignTotalRecipients?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	campaignSentCount?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	campaignFailedCount?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	campaignPendingCount?: number;

	@IsOptional()
	@ValidateNested()
	@Type(() => CampaignOptionsDto)
	campaignOptions?: CampaignOptionsDto;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deletedAt?: Date;
}
