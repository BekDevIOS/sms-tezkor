import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { CampaignStatus } from '../../enums/campaign.enum';

export class CampaignUpdateDto {
	@IsOptional()
	@IsString()
	@MinLength(1)
	title?: string;

	@IsOptional()
	@IsString()
	@MinLength(1)
	message?: string;

	@IsOptional()
	@IsEnum(CampaignStatus)
	status?: CampaignStatus;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	scheduledAt?: Date;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	totalCount?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	sentCount?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	failedCount?: number;
}
