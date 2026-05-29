import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { DevicePlatform, DeviceStatus } from '../../enums/device.enum';
import { SmsLogStatus } from '../../enums/sms-log.enum';

/** Member creates a device slot. */
export class CreateDeviceDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsEnum(DevicePlatform)
  platform?: DevicePlatform;

  @IsOptional()
  @IsString()
  phone?: string;
}

/** Device exchanges its pairing code for a session token. */
export class DeviceClaimInput {
  @IsString()
  @MinLength(1)
  code: string;
}

/** Device keep-alive ping. */
export class HeartbeatInput {
  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  batteryLevel?: number;

  @IsOptional()
  @IsString()
  networkType?: string;

  @IsOptional()
  @IsString()
  appVersion?: string;
}

/** Device reports the outcome of one recipient send. */
export class ReportResultInput {
  @IsMongoId()
  recipientId: string;

  @IsEnum(SmsLogStatus, { message: 'status must be SENT or FAILED' })
  status: SmsLogStatus.SENT | SmsLogStatus.FAILED;

  @IsOptional()
  @IsString()
  failReason?: string;

  @IsOptional()
  @IsObject()
  providerResponse?: Record<string, unknown>;
}
