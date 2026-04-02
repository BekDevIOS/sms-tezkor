import type { Types } from 'mongoose';
import type {
	DeviceNetworkTypeValue,
	DevicePlatformValue,
	DeviceStatusValue,
} from '../enums/Device.enum';

export interface DeviceSettings {
	maxBatchSize: number;
	smsIntervalSec: number;
	batchPauseSec: number;
	dailyLimit: number;
	isEnabled: boolean;
}

export interface Device {
	userId: Types.ObjectId;
	deviceStatus: DeviceStatusValue;
	devicePlatform: DevicePlatformValue;
	deviceName: string;
	deviceCode: string;
	deviceSocketId: string;
	devicePhone: string;
	deviceCarrier: string;
	deviceNetworkType: DeviceNetworkTypeValue;
	deviceBatteryLevel: number;
	deviceAppVersion: string;
	deviceLastSeenAt?: Date;
	devicePairedAt?: Date;
	deviceDailySentCount: number;
	deviceDailyFailedCount: number;
	deviceSettings: DeviceSettings;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
