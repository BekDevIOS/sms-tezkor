import { Schema } from 'mongoose';
import {
	DEVICE_NETWORK_TYPE_VALUES,
	DEVICE_PLATFORM_VALUES,
	DEVICE_STATUS_VALUES,
	DeviceNetworkType,
	DevicePlatform,
	DeviceStatus,
} from '../libs/enums/Device.enum';

const DeviceSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
			index: true,
		},

		deviceStatus: {
			type: String,
			enum: DEVICE_STATUS_VALUES,
			default: DeviceStatus.OFFLINE,
			index: true,
		},
		devicePlatform: {
			type: String,
			enum: DEVICE_PLATFORM_VALUES,
			default: DevicePlatform.ANDROID,
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
			enum: DEVICE_NETWORK_TYPE_VALUES,
			default: DeviceNetworkType.UNKNOWN,
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