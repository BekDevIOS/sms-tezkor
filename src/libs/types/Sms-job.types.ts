import type { Types } from 'mongoose';
import type { SmsJobStatusValue, SmsJobTypeValue } from '../enums/Sms-job.enum';

export interface SmsJob {
	userId: Types.ObjectId;
	campaignId?: Types.ObjectId;
	campaignRecipientId?: Types.ObjectId;
	contactId?: Types.ObjectId;
	deviceId?: Types.ObjectId;
	jobType: SmsJobTypeValue;
	jobStatus: SmsJobStatusValue;
	jobPhone: string;
	jobMessage: string;
	jobAttempts: number;
	jobMaxAttempts: number;
	jobPriority: number;
	jobScheduledFor?: Date;
	jobProcessedAt?: Date;
	jobFinishedAt?: Date;
	jobFailReason: string;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
