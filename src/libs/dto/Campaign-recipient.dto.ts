import { Type } from 'class-transformer';
import {
	IsDate,
	IsIn,
	IsMongoId,
	IsOptional,
	IsString,
} from 'class-validator';
import {
	CAMPAIGN_RECIPIENT_STATUS_VALUES,
	type CampaignRecipientStatusValue,
} from '../enums/Campaign-recipient.enum';

export class CreateCampaignRecipientDto {
	@IsMongoId()
	userId!: string;

	@IsMongoId()
	campaignId!: string;

	@IsMongoId()
	contactId!: string;

	@IsOptional()
	@IsMongoId()
	deviceId?: string;

	@IsOptional()
	@IsIn(CAMPAIGN_RECIPIENT_STATUS_VALUES)
	recipientStatus?: CampaignRecipientStatusValue;

	@IsString()
	recipientPhone!: string;

	@IsOptional()
	@IsString()
	recipientFailReason?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	recipientSentAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	recipientProcessedAt?: Date;
}

export class UpdateCampaignRecipientDto {
	@IsOptional()
	@IsMongoId()
	deviceId?: string;

	@IsOptional()
	@IsIn(CAMPAIGN_RECIPIENT_STATUS_VALUES)
	recipientStatus?: CampaignRecipientStatusValue;

	@IsOptional()
	@IsString()
	recipientPhone?: string;

	@IsOptional()
	@IsString()
	recipientFailReason?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	recipientSentAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	recipientProcessedAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deletedAt?: Date;
}
