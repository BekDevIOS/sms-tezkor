import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Min, MinLength, Max } from 'class-validator';
import { DevicePlatform, DeviceStatus } from '../../enums/device.enum';

export class DeviceUpdateDto {
	@IsOptional()
	@IsString()
	@MinLength(1)
	code?: string;

	@IsOptional()
	@IsString()
	@MinLength(1)
	name?: string;

	@IsOptional()
	@IsEnum(DeviceStatus)
	status?: DeviceStatus;

	@IsOptional()
	@IsEnum(DevicePlatform)
	platform?: DevicePlatform;

	@IsOptional()
	@IsString()
	phone?: string;

	@IsOptional()
	@IsString()
	carrier?: string;

	@IsOptional()
	@IsString()
	networkType?: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	@Max(100)
	batteryLevel?: number;

	@IsOptional()
	@IsString()
	appVersion?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	lastSeenAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	pairedAt?: Date;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	currentLoad?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	sendLimitPerMinute?: number;
}
