import { Schema } from 'mongoose';
import { SessionOwnerType } from '../libs/enums/session.enum';

const SessionSchema = new Schema(
	{
		ownerId: {
			type: Schema.Types.ObjectId,
			required: true,
			index: true,
		},
		type: {
			type: String,
			enum: SessionOwnerType,
			required: true,
		},
		token: {
			type: String,
			required: true,
			index: true,
		},
		expiresAt: {
			type: Date,
			required: true,
			index: true,
		},
	},
	{ timestamps: true, collection: 'sessions' },
);

SessionSchema.index({ ownerId: 1, type: 1 });

export default SessionSchema;
