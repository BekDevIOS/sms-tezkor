import { Type } from 'class-transformer';
import {
	IsDate,
	IsIn,
	IsInt,
	IsMongoId,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';
import {
	SMS_JOB_STATUS_VALUES,
	SMS_JOB_TYPE_VALUES,
	type SmsJobStatusValue,
	type SmsJobTypeValue,
} from '../enums/Sms-job.enum';

export class CreateSmsJobDto {
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
	@IsIn(SMS_JOB_TYPE_VALUES)
	jobType?: SmsJobTypeValue;

	@IsOptional()
	@IsIn(SMS_JOB_STATUS_VALUES)
	jobStatus?: SmsJobStatusValue;

	@IsString()
	jobPhone!: string;

	@IsString()
	jobMessage!: string;

	@IsOptional()
	@IsInt()
	@Min(0)
	jobAttempts?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	jobMaxAttempts?: number;

	@IsOptional()
	@IsNumber()
	jobPriority?: number;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	jobScheduledFor?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	jobProcessedAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	jobFinishedAt?: Date;

	@IsOptional()
	@IsString()
	jobFailReason?: string;
}

export class UpdateSmsJobDto {
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
	@IsIn(SMS_JOB_TYPE_VALUES)
	jobType?: SmsJobTypeValue;

	@IsOptional()
	@IsIn(SMS_JOB_STATUS_VALUES)
	jobStatus?: SmsJobStatusValue;

	@IsOptional()
	@IsString()
	jobPhone?: string;

	@IsOptional()
	@IsString()
	jobMessage?: string;

	@IsOptional()
	@IsInt()
	@Min(0)
	jobAttempts?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	jobMaxAttempts?: number;

	@IsOptional()
	@IsNumber()
	jobPriority?: number;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	jobScheduledFor?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	jobProcessedAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	jobFinishedAt?: Date;

	@IsOptional()
	@IsString()
	jobFailReason?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deletedAt?: Date;
}
