import { Schema } from 'mongoose';
import {
	CAMPAIGN_RECIPIENT_STATUS_VALUES,
	CampaignRecipientStatus,
} from '../libs/enums/Campaign-recipient.enum';

const CampaignRecipientSchema = new Schema(
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
			required: true,
			index: true,
		},
		contactId: {
			type: Schema.Types.ObjectId,
			ref: 'Contact',
			required: true,
			index: true,
		},
		deviceId: {
			type: Schema.Types.ObjectId,
			ref: 'Device',
			index: true,
		},

		recipientStatus: {
			type: String,
			enum: CAMPAIGN_RECIPIENT_STATUS_VALUES,
			default: CampaignRecipientStatus.PENDING,
			index: true,
		},
		recipientPhone: {
			type: String,
			required: true,
			trim: true,
		},
		recipientFailReason: {
			type: String,
			default: '',
		},
		recipientSentAt: {
			type: Date,
		},
		recipientProcessedAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'campaignRecipients' },
);

CampaignRecipientSchema.index({ campaignId: 1, contactId: 1 }, { unique: true });

export default CampaignRecipientSchema;
