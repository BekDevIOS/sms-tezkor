import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsMongoId, IsObject, IsOptional, IsString } from 'class-validator';
import { SmsLogStatus } from '../../enums/sms-log.enum';

export class SmsLogDto {
	@IsMongoId()
	_id!: string;

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

	@IsEnum(SmsLogStatus)
	status!: SmsLogStatus;

	@IsOptional()
	@IsObject()
	providerResponse?: Record<string, unknown>;

	@Type(() => Date)
	@IsDate()
	createdAt!: Date;

	@Type(() => Date)
	@IsDate()
	updatedAt!: Date;
}
