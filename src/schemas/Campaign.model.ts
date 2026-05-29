import { Schema } from 'mongoose';
import { CampaignStatus } from '../libs/enums/campaign.enum';

const CampaignSchema = new Schema(
	{
		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
			index: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		message: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: CampaignStatus,
			default: CampaignStatus.DRAFT,
			index: true,
		},
		scheduledAt: {
			type: Date,
		},
		totalCount: {
			type: Number,
			default: 0,
			min: 0,
		},
		sentCount: {
			type: Number,
			default: 0,
			min: 0,
		},
		failedCount: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{ timestamps: true, collection: 'campaigns' },
);

CampaignSchema.index({ memberId: 1, status: 1 });

export default CampaignSchema;
