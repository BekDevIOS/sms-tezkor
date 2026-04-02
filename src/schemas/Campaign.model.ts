import { Schema } from 'mongoose';
import {
	CAMPAIGN_SENDER_MODE_VALUES,
	CAMPAIGN_STATUS_VALUES,
	CAMPAIGN_TYPE_VALUES,
	CampaignSenderMode,
	CampaignStatus,
	CampaignType,
} from '../libs/enums/Campaign.enum';

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
			enum: CAMPAIGN_TYPE_VALUES,
			default: CampaignType.INSTANT,
		},
		campaignStatus: {
			type: String,
			enum: CAMPAIGN_STATUS_VALUES,
			default: CampaignStatus.DRAFT,
			index: true,
		},
		campaignSenderMode: {
			type: String,
			enum: CAMPAIGN_SENDER_MODE_VALUES,
			default: CampaignSenderMode.DEVICE,
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