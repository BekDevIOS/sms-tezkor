import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { availableAutoReplySort } from '../../config';
import { AutoReplyMatchType, AutoReplyStatus } from '../../enums/auto-reply.enum';
import { Direction } from '../../enums/common';

export class CreateAutoReplyDto {
  @IsString()
  @MinLength(1)
  triggerText: string;

  @IsString()
  @MinLength(1)
  replyBody: string;

  @IsOptional()
  @IsEnum(AutoReplyMatchType)
  matchType?: AutoReplyMatchType;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsMongoId()
  deviceId?: string;

  @IsOptional()
  @IsEnum(AutoReplyStatus)
  status?: AutoReplyStatus;
}

export class UpdateAutoReplyDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  triggerText?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  replyBody?: string;

  @IsOptional()
  @IsEnum(AutoReplyMatchType)
  matchType?: AutoReplyMatchType;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsMongoId()
  deviceId?: string;

  @IsOptional()
  @IsEnum(AutoReplyStatus)
  status?: AutoReplyStatus;
}

export class ARSearch {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  text?: string;

  @IsOptional()
  @IsEnum(AutoReplyStatus)
  status?: AutoReplyStatus;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class AutoRepliesInquiry {
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
  @IsIn(availableAutoReplySort)
  sort?: (typeof availableAutoReplySort)[number];

  @IsOptional()
  @IsEnum(Direction)
  direction?: Direction;

  @IsOptional()
  @Type(() => ARSearch)
  search?: ARSearch;
}
