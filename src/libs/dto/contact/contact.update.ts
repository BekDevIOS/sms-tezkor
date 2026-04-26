import { IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ContactStatus } from '../../enums/contact.enum';

export class ContactUpdateDto {
	@IsOptional()
	@IsString()
	@MinLength(1)
	name?: string;

	@IsOptional()
	@IsString()
	@MinLength(1)
	phone?: string;

	@IsOptional()
	@IsEnum(ContactStatus)
	status?: ContactStatus;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags?: string[];
}
