import { Schema } from 'mongoose';

const SmsLogSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
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
			enum: ['OUTGOING'],
			default: 'OUTGOING',
		},
		logStatus: {
			type: String,
			enum: ['SENT', 'FAILED', 'DELIVERED'],
			default: 'SENT',
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