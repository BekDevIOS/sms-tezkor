import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateContactGroupDto {
	@IsMongoId()
	userId!: string;

	@IsString()
	groupName!: string;

	@IsOptional()
	@IsString()
	groupDesc?: string;
}

export class UpdateContactGroupDto {
	@IsOptional()
	@IsString()
	groupName?: string;

	@IsOptional()
	@IsString()
	groupDesc?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deletedAt?: Date;
}
