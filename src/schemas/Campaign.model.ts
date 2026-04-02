import { Schema } from 'mongoose';

const CampaignSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		deviceIds: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Device',
			},
		],

		campaignType: {
			type: String,
			enum: ['INSTANT', 'SCHEDULED'],
			default: 'INSTANT',
		},
		campaignStatus: {
			type: String,
			enum: ['DRAFT', 'SCHEDULED', 'PROCESSING', 'PAUSED', 'COMPLETED', 'FAILED', 'CANCELLED'],
			default: 'DRAFT',
			index: true,
		},
		campaignSenderMode: {
			type: String,
			enum: ['DEVICE'],
			default: 'DEVICE',
		},

		campaignTitle: {
			type: String,
			required: true,
			trim: true,
		},
		campaignMessage: {
			type: String,
			required: true,
		},

		campaignScheduledAt: {
			type: Date,
			index: true,
		},
		campaignStartedAt: {
			type: Date,
		},
		campaignCompletedAt: {
			type: Date,
		},

		campaignTotalRecipients: {
			type: Number,
			default: 0,
		},
		campaignSentCount: {
			type: Number,
			default: 0,
		},
		campaignFailedCount: {
			type: Number,
			default: 0,
		},
		campaignPendingCount: {
			type: Number,
			default: 0,
		},

		campaignOptions: {
			allowReplyTracking: {
				type: Boolean,
				default: true,
			},
			useRandomDelay: {
				type: Boolean,
				default: true,
			},
			minDelaySec: {
				type: Number,
				default: 2,
			},
			maxDelaySec: {
				type: Number,
				default: 5,
			},
			batchSize: {
				type: Number,
				default: 100,
			},
			batchPauseSec: {
				type: Number,
				default: 120,
			},
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'campaigns' },
);

export default CampaignSchema;