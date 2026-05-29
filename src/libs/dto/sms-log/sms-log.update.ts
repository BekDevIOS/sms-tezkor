import { IsEnum, IsMongoId, IsObject, IsOptional, IsString } from 'class-validator';
import { SmsLogStatus } from '../../enums/sms-log.enum';

export class SmsLogUpdateDto {
	@IsOptional()
	@IsMongoId()
	memberId?: string;

	@IsOptional()
	@IsMongoId()
	deviceId?: string;

	@IsOptional()
	@IsMongoId()
	campaignId?: string;

	@IsOptional()
	@IsMongoId()
	contactId?: string;

	@IsOptional()
	@IsString()
	phone?: string;

	@IsOptional()
	@IsString()
	message?: string;

	@IsOptional()
	@IsEnum(SmsLogStatus)
	status?: SmsLogStatus;

	@IsOptional()
	@IsObject()
	providerResponse?: Record<string, unknown>;
}
