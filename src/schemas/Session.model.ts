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
		},
	},
	{ timestamps: true, collection: 'sessions' },
);

SessionSchema.index({ ownerId: 1, type: 1 });
// TTL index: MongoDB auto-purges sessions once `expiresAt` passes.
// NOTE: on an existing cluster that already has a plain `expiresAt_1` index,
// drop it once (`db.sessions.dropIndex('expiresAt_1')`) so Mongoose can
// recreate it with `expireAfterSeconds` — Mongo will not mutate it in place.
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default SessionSchema;
