import { Schema } from 'mongoose';
import {
	SMS_LOG_DIRECTION_VALUES,
	SMS_LOG_STATUS_VALUES,
	SmsLogDirection,
	SmsLogStatus,
} from '../libs/enums/Sms-log.enum';

const SmsLogSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
			index: true,
		},
		campaignId: {
			type: Schema.Types.ObjectId,
			ref: 'Campaign',
			index: true,
		},
		campaignRecipientId: {
			type: Schema.Types.ObjectId,
			ref: 'CampaignRecipient',
			index: true,
		},
		contactId: {
			type: Schema.Types.ObjectId,
			ref: 'Contact',
			index: true,
		},
		deviceId: {
			type: Schema.Types.ObjectId,
			ref: 'Device',
			index: true,
		},

		logDirection: {
			type: String,
			enum: SMS_LOG_DIRECTION_VALUES,
			default: SmsLogDirection.OUTGOING,
		},
		logStatus: {
			type: String,
			enum: SMS_LOG_STATUS_VALUES,
			default: SmsLogStatus.SENT,
			index: true,
		},

		logPhone: {
			type: String,
			required: true,
			trim: true,
		},
		logMessage: {
			type: String,
			required: true,
		},

		logProviderStatus: {
			type: String,
			default: '',
		},
		logErrorCode: {
			type: String,
			default: '',
		},
		logErrorMessage: {
			type: String,
			default: '',
		},

		logSentAt: {
			type: Date,
		},
		logDeliveredAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'smsLogs' },
);

export default SmsLogSchema;