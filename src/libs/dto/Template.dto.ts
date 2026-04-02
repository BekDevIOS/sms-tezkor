import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateTemplateDto {
	@IsMongoId()
	userId!: string;

	@IsString()
	templateName!: string;

	@IsOptional()
	@IsString()
	templateCategory?: string;

	@IsString()
	templateContent!: string;
}

export class UpdateTemplateDto {
	@IsOptional()
	@IsString()
	templateName?: string;

	@IsOptional()
	@IsString()
	templateCategory?: string;

	@IsOptional()
	@IsString()
	templateContent?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deletedAt?: Date;
}
