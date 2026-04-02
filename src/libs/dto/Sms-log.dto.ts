import { Type } from 'class-transformer';
import {
	IsDate,
	IsIn,
	IsMongoId,
	IsOptional,
	IsString,
} from 'class-validator';
import {
	SMS_LOG_DIRECTION_VALUES,
	SMS_LOG_STATUS_VALUES,
	type SmsLogDirectionValue,
	type SmsLogStatusValue,
} from '../enums/Sms-log.enum';

export class CreateSmsLogDto {
	@IsMongoId()
	userId!: string;

	@IsOptional()
	@IsMongoId()
	campaignId?: string;

	@IsOptional()
	@IsMongoId()
	campaignRecipientId?: string;

	@IsOptional()
	@IsMongoId()
	contactId?: string;

	@IsOptional()
	@IsMongoId()
	deviceId?: string;

	@IsOptional()
	@IsIn(SMS_LOG_DIRECTION_VALUES)
	logDirection?: SmsLogDirectionValue;

	@IsOptional()
	@IsIn(SMS_LOG_STATUS_VALUES)
	logStatus?: SmsLogStatusValue;

	@IsString()
	logPhone!: string;

	@IsString()
	logMessage!: string;

	@IsOptional()
	@IsString()
	logProviderStatus?: string;

	@IsOptional()
	@IsString()
	logErrorCode?: string;

	@IsOptional()
	@IsString()
	logErrorMessage?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	logSentAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	logDeliveredAt?: Date;
}

export class UpdateSmsLogDto {
	@IsOptional()
	@IsMongoId()
	campaignId?: string;

	@IsOptional()
	@IsMongoId()
	campaignRecipientId?: string;

	@IsOptional()
	@IsMongoId()
	contactId?: string;

	@IsOptional()
	@IsMongoId()
	deviceId?: string;

	@IsOptional()
	@IsIn(SMS_LOG_DIRECTION_VALUES)
	logDirection?: SmsLogDirectionValue;

	@IsOptional()
	@IsIn(SMS_LOG_STATUS_VALUES)
	logStatus?: SmsLogStatusValue;

	@IsOptional()
	@IsString()
	logPhone?: string;

	@IsOptional()
	@IsString()
	logMessage?: string;

	@IsOptional()
	@IsString()
	logProviderStatus?: string;

	@IsOptional()
	@IsString()
	logErrorCode?: string;

	@IsOptional()
	@IsString()
	logErrorMessage?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	logSentAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	logDeliveredAt?: Date;
}
