import type { Types } from 'mongoose';
import type { IncomingMessageStatusValue } from '../enums/Incoming-message.enum';

export interface IncomingMessage {
	userId: Types.ObjectId;
	deviceId: Types.ObjectId;
	matchedContactId?: Types.ObjectId;
	matchedCampaignId?: Types.ObjectId;
	matchedCampaignRecipientId?: Types.ObjectId;
	messageStatus: IncomingMessageStatusValue;
	messageFromPhone: string;
	messageToPhone: string;
	messageBody: string;
	messageReceivedAt: Date;
	createdAt: Date;
	updatedAt: Date;
}
