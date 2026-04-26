import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';
import { ContactStatus } from '../../enums/contact.enum';

export class ContactInputDto {
	@IsMongoId()
	memberId!: string;

	@IsOptional()
	@IsString()
	@MinLength(1)
	name?: string;

	@IsString()
	@MinLength(1)
	phone!: string;

	@IsOptional()
	@IsEnum(ContactStatus)
	status?: ContactStatus;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags?: string[];
}
