import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsDate,
	IsMongoId,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateDeviceSessionDto {
	@IsMongoId()
	userId!: string;

	@IsMongoId()
	deviceId!: string;

	@IsString()
	sessionAccessToken!: string;

	@IsOptional()
	@IsString()
	sessionRefreshToken?: string;

	@IsOptional()
	@IsString()
	sessionIpAddress?: string;

	@IsOptional()
	@IsString()
	sessionUserAgent?: string;

	@IsOptional()
	@IsBoolean()
	sessionIsActive?: boolean;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	sessionLastSeenAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	sessionExpiresAt?: Date;
}

export class UpdateDeviceSessionDto {
	@IsOptional()
	@IsString()
	sessionAccessToken?: string;

	@IsOptional()
	@IsString()
	sessionRefreshToken?: string;

	@IsOptional()
	@IsString()
	sessionIpAddress?: string;

	@IsOptional()
	@IsString()
	sessionUserAgent?: string;

	@IsOptional()
	@IsBoolean()
	sessionIsActive?: boolean;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	sessionLastSeenAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	sessionExpiresAt?: Date;
}
