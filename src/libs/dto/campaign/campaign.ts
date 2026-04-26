import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsMongoId, IsOptional, IsString } from 'class-validator';
import { CampaignStatus } from '../../enums/campaign.enum';

export class CampaignDto {
	@IsMongoId()
	_id!: string;

	@IsMongoId()
	memberId!: string;

	@IsString()
	title!: string;

	@IsString()
	message!: string;

	@IsEnum(CampaignStatus)
	status!: CampaignStatus;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	scheduledAt?: Date;

	@Type(() => Number)
	@IsInt()
	totalCount!: number;

	@Type(() => Number)
	@IsInt()
	sentCount!: number;

	@Type(() => Number)
	@IsInt()
	failedCount!: number;

	@Type(() => Date)
	@IsDate()
	createdAt!: Date;

	@Type(() => Date)
	@IsDate()
	updatedAt!: Date;
}
