import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ContactStatus } from '../../enums/contact.enum';

export class ContactDto {
	@IsMongoId()
	_id!: string;

	@IsMongoId()
	memberId!: string;

	@IsOptional()
	@IsString()
	name?: string;

	@IsString()
	phone!: string;

	@IsEnum(ContactStatus)
	status!: ContactStatus;

	@IsArray()
	@IsString({ each: true })
	tags!: string[];

	@Type(() => Date)
	@IsDate()
	createdAt!: Date;

	@Type(() => Date)
	@IsDate()
	updatedAt!: Date;
}
