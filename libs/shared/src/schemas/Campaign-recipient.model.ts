import { Schema } from 'mongoose';
import { CampaignRecipientStatus } from '../libs/enums/campaign-recipient.enum';

const CampaignRecipientSchema = new Schema(
	{
		campaignId: {
			type: Schema.Types.ObjectId,
			ref: 'Campaign',
			required: true,
			index: true,
		},
		contactId: {
			type: Schema.Types.ObjectId,
			ref: 'Contact',
			index: true,
		},
		phone: {
			type: String,
			required: true,
			trim: true,
		},
		assignedDeviceId: {
			type: Schema.Types.ObjectId,
			ref: 'Device',
			index: true,
		},
		status: {
			type: String,
			enum: CampaignRecipientStatus,
			default: CampaignRecipientStatus.PENDING,
			index: true,
		},
		attempts: {
			type: Number,
			default: 0,
			min: 0,
		},
		failReason: {
			type: String,
			trim: true,
		},
		sentAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'campaign_recipients' },
);

CampaignRecipientSchema.index({ campaignId: 1, status: 1 });
CampaignRecipientSchema.index({ status: 1, assignedDeviceId: 1 });

export default CampaignRecipientSchema;
