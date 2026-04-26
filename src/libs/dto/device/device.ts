import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsMongoId, IsOptional, IsString, Max, Min } from 'class-validator';
import { DevicePlatform, DeviceStatus } from '../../enums/device.enum';

export class DeviceDto {
	@IsMongoId()
	_id!: string;

	@IsMongoId()
	memberId!: string;

	@IsString()
	code!: string;

	@IsString()
	name!: string;

	@IsEnum(DeviceStatus)
	status!: DeviceStatus;

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

	@Type(() => Number)
	@IsInt()
	currentLoad!: number;

	@Type(() => Number)
	@IsInt()
	sendLimitPerMinute!: number;

	@Type(() => Date)
	@IsDate()
	createdAt!: Date;

	@Type(() => Date)
	@IsDate()
	updatedAt!: Date;
}
