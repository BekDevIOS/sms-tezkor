import { Schema } from 'mongoose';

const SmsJobSchema = new Schema(
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

		jobType: {
			type: String,
			enum: ['SEND_SMS'],
			default: 'SEND_SMS',
		},
		jobStatus: {
			type: String,
			enum: ['WAITING', 'ACTIVE', 'COMPLETED', 'FAILED', 'CANCELLED'],
			default: 'WAITING',
			index: true,
		},

		jobPhone: {
			type: String,
			required: true,
			trim: true,
		},
		jobMessage: {
			type: String,
			required: true,
		},

		jobAttempts: {
			type: Number,
			default: 0,
		},
		jobMaxAttempts: {
			type: Number,
			default: 3,
		},
		jobPriority: {
			type: Number,
			default: 1,
		},

		jobScheduledFor: {
			type: Date,
			index: true,
		},
		jobProcessedAt: {
			type: Date,
		},
		jobFinishedAt: {
			type: Date,
		},
		jobFailReason: {
			type: String,
			default: '',
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'smsJobs' },
);

export default SmsJobSchema;