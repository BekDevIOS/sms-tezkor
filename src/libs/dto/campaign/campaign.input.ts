import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { availableCampaignSort } from '../../config';
import { CampaignStatus } from '../../enums/campaign.enum';
import { Direction } from '../../enums/common';

export class CreateCampaignDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  message: string;

  /** When set, the campaign is queued and activated by the scheduler at this time. */
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledAt?: Date;

  /** Activate and dispatch immediately on creation. */
  @IsOptional()
  @IsBoolean()
  sendNow?: boolean;

  /** Recipients sourced from existing contacts (must belong to the member). */
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  contactIds?: string[];

  /** Recipients sourced from one or more saved contact groups. */
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  groupIds?: string[];

  /** Raw phone numbers not tied to a stored contact. */
  @ValidateIf((o) => (!o.contactIds || o.contactIds.length === 0) && (!o.groupIds || o.groupIds.length === 0))
  @IsArray()
  @ArrayNotEmpty({ message: 'Provide contactIds and/or phones' })
  @IsString({ each: true })
  phones?: string[];
}

export class CampaignsInquiry {
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
  @IsIn(availableCampaignSort)
  sort?: (typeof availableCampaignSort)[number];

  @IsOptional()
  @IsEnum(Direction)
  direction?: Direction;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;
}
