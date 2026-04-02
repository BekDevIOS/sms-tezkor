import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsDate,
	IsIn,
	IsInt,
	IsMongoId,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
	ValidateNested,
} from 'class-validator';
import {
	DEVICE_NETWORK_TYPE_VALUES,
	DEVICE_PLATFORM_VALUES,
	DEVICE_STATUS_VALUES,
	type DeviceNetworkTypeValue,
	type DevicePlatformValue,
	type DeviceStatusValue,
} from '../enums/Device.enum';

export class DeviceSettingsDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	maxBatchSize?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	smsIntervalSec?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	batchPauseSec?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	dailyLimit?: number;

	@IsOptional()
	@IsBoolean()
	isEnabled?: boolean;
}

export class CreateDeviceDto {
	@IsMongoId()
	userId!: string;

	@IsOptional()
	@IsIn(DEVICE_STATUS_VALUES)
	deviceStatus?: DeviceStatusValue;

	@IsOptional()
	@IsIn(DEVICE_PLATFORM_VALUES)
	devicePlatform?: DevicePlatformValue;

	@IsString()
	deviceName!: string;

	@IsString()
	deviceCode!: string;

	@IsOptional()
	@IsString()
	deviceSocketId?: string;

	@IsOptional()
	@IsString()
	devicePhone?: string;

	@IsOptional()
	@IsString()
	deviceCarrier?: string;

	@IsOptional()
	@IsIn(DEVICE_NETWORK_TYPE_VALUES)
	deviceNetworkType?: DeviceNetworkTypeValue;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(100)
	deviceBatteryLevel?: number;

	@IsOptional()
	@IsString()
	deviceAppVersion?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deviceLastSeenAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	devicePairedAt?: Date;

	@IsOptional()
	@IsInt()
	@Min(0)
	deviceDailySentCount?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	deviceDailyFailedCount?: number;

	@IsOptional()
	@ValidateNested()
	@Type(() => DeviceSettingsDto)
	deviceSettings?: DeviceSettingsDto;
}

export class UpdateDeviceDto {
	@IsOptional()
	@IsIn(DEVICE_STATUS_VALUES)
	deviceStatus?: DeviceStatusValue;

	@IsOptional()
	@IsIn(DEVICE_PLATFORM_VALUES)
	devicePlatform?: DevicePlatformValue;

	@IsOptional()
	@IsString()
	deviceName?: string;

	@IsOptional()
	@IsString()
	deviceCode?: string;

	@IsOptional()
	@IsString()
	deviceSocketId?: string;

	@IsOptional()
	@IsString()
	devicePhone?: string;

	@IsOptional()
	@IsString()
	deviceCarrier?: string;

	@IsOptional()
	@IsIn(DEVICE_NETWORK_TYPE_VALUES)
	deviceNetworkType?: DeviceNetworkTypeValue;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(100)
	deviceBatteryLevel?: number;

	@IsOptional()
	@IsString()
	deviceAppVersion?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deviceLastSeenAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	devicePairedAt?: Date;

	@IsOptional()
	@IsInt()
	@Min(0)
	deviceDailySentCount?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	deviceDailyFailedCount?: number;

	@IsOptional()
	@ValidateNested()
	@Type(() => DeviceSettingsDto)
	deviceSettings?: DeviceSettingsDto;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deletedAt?: Date;
}
