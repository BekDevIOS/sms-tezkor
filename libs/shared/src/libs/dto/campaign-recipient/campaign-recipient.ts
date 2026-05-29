import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsMongoId, IsOptional, IsString } from 'class-validator';
import { CampaignRecipientStatus } from '../../enums/campaign-recipient.enum';

export class CampaignRecipientDto {
	@IsMongoId()
	_id!: string;

	@IsMongoId()
	campaignId!: string;

	@IsOptional()
	@IsMongoId()
	contactId?: string;

	@IsString()
	phone!: string;

	@IsOptional()
	@IsMongoId()
	assignedDeviceId?: string;

	@IsEnum(CampaignRecipientStatus)
	status!: CampaignRecipientStatus;

	@Type(() => Number)
	@IsInt()
	attempts!: number;

	@IsOptional()
	@IsString()
	failReason?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	sentAt?: Date;

	@Type(() => Date)
	@IsDate()
	createdAt!: Date;

	@Type(() => Date)
	@IsDate()
	updatedAt!: Date;
}
