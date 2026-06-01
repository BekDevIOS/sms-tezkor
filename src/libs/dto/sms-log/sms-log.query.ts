import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { availableSmsLogSort } from '../../config';
import { Direction } from '../../enums/common';
import { SmsLogStatus } from '../../enums/sms-log.enum';
import { SmsLogDto } from './sms-log';

export class SmsLogSearch {
  /** Matches the recipient phone (escaped, case-insensitive). */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  text?: string;

  @IsOptional()
  @IsEnum(SmsLogStatus)
  status?: SmsLogStatus;

  @IsOptional()
  @IsMongoId()
  campaignId?: string;

  @IsOptional()
  @IsMongoId()
  deviceId?: string;

  /** Admin-only filter: scope to a specific member. Ignored on /sms-log. */
  @IsOptional()
  @IsMongoId()
  memberId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;
}

export class SmsLogsInquiry {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsInt()
  @Min(1)
  @Max(200)
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsIn(availableSmsLogSort)
  sort?: (typeof availableSmsLogSort)[number];

  @IsOptional()
  @IsEnum(Direction)
  direction?: Direction;

  @IsOptional()
  @Type(() => SmsLogSearch)
  search?: SmsLogSearch;
}

export class SmsLogs {
  list: SmsLogDto[];
  total: number;
}
