import { Schema } from 'mongoose';
import {
	INCOMING_MESSAGE_STATUS_VALUES,
	IncomingMessageStatus,
} from '../libs/enums/Incoming-message.enum';

const IncomingMessageSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		deviceId: {
			type: Schema.Types.ObjectId,
			ref: 'Device',
			required: true,
			index: true,
		},
		matchedContactId: {
			type: Schema.Types.ObjectId,
			ref: 'Contact',
			index: true,
		},
		matchedCampaignId: {
			type: Schema.Types.ObjectId,
			ref: 'Campaign',
			index: true,
		},
		matchedCampaignRecipientId: {
			type: Schema.Types.ObjectId,
			ref: 'CampaignRecipient',
			index: true,
		},

		messageStatus: {
			type: String,
			enum: INCOMING_MESSAGE_STATUS_VALUES,
			default: IncomingMessageStatus.UNREAD,
			index: true,
		},

		messageFromPhone: {
			type: String,
			required: true,
			trim: true,
		},
		messageToPhone: {
			type: String,
			default: '',
			trim: true,
		},
		messageBody: {
			type: String,
			required: true,
		},
		messageReceivedAt: {
			type: Date,
			required: true,
			index: true,
		},
	},
	{ timestamps: true, collection: 'incomingMessages' },
);

export default IncomingMessageSchema;