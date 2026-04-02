import { Schema } from 'mongoose';
import {
	SMS_JOB_STATUS_VALUES,
	SMS_JOB_TYPE_VALUES,
	SmsJobStatus,
	SmsJobType,
} from '../libs/enums/Sms-job.enum';

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
			enum: SMS_JOB_TYPE_VALUES,
			default: SmsJobType.SEND_SMS,
		},
		jobStatus: {
			type: String,
			enum: SMS_JOB_STATUS_VALUES,
			default: SmsJobStatus.WAITING,
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