import { Schema } from 'mongoose';
import { DevicePlatform, DeviceStatus } from '../libs/enums/device.enum';

const DeviceSchema = new Schema(
	{
		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'members',
			required: true,
			index: true,
		},
		code: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: DeviceStatus,
			default: DeviceStatus.OFFLINE,
			index: true,
		},
		platform: {
			type: String,
			enum: DevicePlatform,
		},
		phone: {
			type: String,
			trim: true,
		},
		carrier: {
			type: String,
			trim: true,
		},
		simSubscriptionId: {
			type: Number,
			min: 0,
		},
		simSlotIndex: {
			type: Number,
			min: 0,
		},
		simCarrier: {
			type: String,
			trim: true,
		},
		networkType: {
			type: String,
			trim: true,
		},
		batteryLevel: {
			type: Number,
			min: 0,
			max: 100,
		},
		appVersion: {
			type: String,
			trim: true,
		},
		lastSeenAt: {
			type: Date,
		},
		pairedAt: {
			type: Date,
		},
		currentLoad: {
			type: Number,
			default: 0,
			min: 0,
		},
		sendLimitPerMinute: {
			type: Number,
			default: 60,
			min: 1,
		},
	},
	{ timestamps: true, collection: 'devices' },
);

DeviceSchema.index({ memberId: 1, status: 1 });

export default DeviceSchema;
