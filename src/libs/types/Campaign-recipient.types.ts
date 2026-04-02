import type { Types } from 'mongoose';
import type { CampaignRecipientStatusValue } from '../enums/Campaign-recipient.enum';

export interface CampaignRecipient {
	userId: Types.ObjectId;
	campaignId: Types.ObjectId;
	contactId: Types.ObjectId;
	deviceId?: Types.ObjectId;
	recipientStatus: CampaignRecipientStatusValue;
	recipientPhone: string;
	recipientFailReason: string;
	recipientSentAt?: Date;
	recipientProcessedAt?: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
