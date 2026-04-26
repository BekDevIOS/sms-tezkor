import { Schema } from 'mongoose';
import { SmsLogStatus } from '../libs/enums/sms-log.enum';

const SmsLogSchema = new Schema(
	{
		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'members',
			index: true,
		},
		deviceId: {
			type: Schema.Types.ObjectId,
			ref: 'devices',
			index: true,	
		},
		campaignId: {
			type: Schema.Types.ObjectId,
			ref: 'campaigns',
			index: true,
		},
		contactId: {
			type: Schema.Types.ObjectId,
			ref: 'contacts',
			index: true,
		},
		phone: {
			type: String,
			trim: true,
		},
		message: {
			type: String,
		},
		status: {
			type: String,
			enum: SmsLogStatus,
			required: true,
			index: true,
		},
		providerResponse: {
			type: Schema.Types.Mixed,
		},
	},
	{ timestamps: true, collection: 'sms_logs' },
);

SmsLogSchema.index({ memberId: 1, createdAt: -1 });

export default SmsLogSchema;
