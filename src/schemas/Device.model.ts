import { Schema } from 'mongoose';

const DeviceSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		deviceStatus: {
			type: String,
			enum: ['OFFLINE', 'ONLINE', 'BUSY', 'ERROR'],
			default: 'OFFLINE',
			index: true,
		},
		devicePlatform: {
			type: String,
			enum: ['ANDROID'],
			default: 'ANDROID',
		},

		deviceName: {
			type: String,
			required: true,
			trim: true,
		},
		deviceCode: {
			type: String,
			required: true,
			index: { unique: true },
			trim: true,
		},
		deviceSocketId: {
			type: String,
			default: '',
		},
		devicePhone: {
			type: String,
			trim: true,
			default: '',
		},
		deviceCarrier: {
			type: String,
			default: '',
		},
		deviceNetworkType: {
			type: String,
			enum: ['WIFI', 'MOBILE', 'UNKNOWN'],
			default: 'UNKNOWN',
		},
		deviceBatteryLevel: {
			type: Number,
			default: 0,
		},
		deviceAppVersion: {
			type: String,
			default: '',
		},
		deviceLastSeenAt: {
			type: Date,
			index: true,
		},
		devicePairedAt: {
			type: Date,
		},

		deviceDailySentCount: {
			type: Number,
			default: 0,
		},
		deviceDailyFailedCount: {
			type: Number,
			default: 0,
		},

		deviceSettings: {
			maxBatchSize: {
				type: Number,
				default: 100,
			},
			smsIntervalSec: {
				type: Number,
				default: 3,
			},
			batchPauseSec: {
				type: Number,
				default: 120,
			},
			dailyLimit: {
				type: Number,
				default: 300,
			},
			isEnabled: {
				type: Boolean,
				default: true,
			},
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'devices' },
);

export default DeviceSchema;