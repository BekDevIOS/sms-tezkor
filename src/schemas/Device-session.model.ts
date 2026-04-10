import { Schema } from 'mongoose';

const DeviceSessionSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
			index: true,
		},
		deviceId: {
			type: Schema.Types.ObjectId,
			ref: 'Device',
			required: true,
			index: true,
		},

		sessionAccessToken: {
			type: String,
			required: true,
		},
		sessionRefreshToken: {
			type: String,
			default: '',
		},
		sessionIpAddress: {
			type: String,
			default: '',
		},
		sessionUserAgent: {
			type: String,
			default: '',
		},
		sessionIsActive: {
			type: Boolean,
			default: true,
			index: true,
		},
		sessionLastSeenAt: {
			type: Date,
		},
		sessionExpiresAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'deviceSessions' },
);

export default DeviceSessionSchema;