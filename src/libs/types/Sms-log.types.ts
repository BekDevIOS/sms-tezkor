import type { Types } from 'mongoose';
import type { SmsLogDirectionValue, SmsLogStatusValue } from '../enums/Sms-log.enum';

export interface SmsLog {
	userId: Types.ObjectId;
	campaignId?: Types.ObjectId;
	campaignRecipientId?: Types.ObjectId;
	contactId?: Types.ObjectId;
	deviceId?: Types.ObjectId;
	logDirection: SmsLogDirectionValue;
	logStatus: SmsLogStatusValue;
	logPhone: string;
	logMessage: string;
	logProviderStatus: string;
	logErrorCode: string;
	logErrorMessage: string;
	logSentAt?: Date;
	logDeliveredAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
