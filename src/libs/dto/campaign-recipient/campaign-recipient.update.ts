import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsMongoId, IsString, Min, MinLength } from 'class-validator';
import { CampaignRecipientStatus } from '../../enums/campaign-recipient.enum';

export class CampaignRecipientUpdateDto {
	@IsOptional()
	@IsMongoId()
	contactId?: string;

	@IsOptional()
	@IsString()
	@MinLength(1)
	phone?: string;

	@IsOptional()
	@IsMongoId()
	assignedDeviceId?: string;

	@IsOptional()
	@IsEnum(CampaignRecipientStatus)
	status?: CampaignRecipientStatus;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	attempts?: number;

	@IsOptional()
	@IsString()
	failReason?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	sentAt?: Date;
}
