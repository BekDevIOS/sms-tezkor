import { Type } from 'class-transformer';
import {
	IsArray,
	IsDate,
	IsEmail,
	IsIn,
	IsMongoId,
	IsOptional,
	IsString,
} from 'class-validator';
import {
	CONTACT_STATUS_VALUES,
	type ContactStatusValue,
} from '../enums/Contact.enum';

export class CreateContactDto {
	@IsMongoId()
	userId!: string;

	@IsOptional()
	@IsArray()
	@IsMongoId({ each: true })
	groupIds?: string[];

	@IsOptional()
	@IsIn(CONTACT_STATUS_VALUES)
	contactStatus?: ContactStatusValue;

	@IsOptional()
	@IsString()
	contactFullName?: string;

	@IsString()
	contactPhone!: string;

	@IsOptional()
	@IsEmail()
	contactEmail?: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	contactTags?: string[];

	@IsOptional()
	@IsString()
	contactNotes?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	contactLastMessageAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	contactLastReplyAt?: Date;
}

export class UpdateContactDto {
	@IsOptional()
	@IsArray()
	@IsMongoId({ each: true })
	groupIds?: string[];

	@IsOptional()
	@IsIn(CONTACT_STATUS_VALUES)
	contactStatus?: ContactStatusValue;

	@IsOptional()
	@IsString()
	contactFullName?: string;

	@IsOptional()
	@IsString()
	contactPhone?: string;

	@IsOptional()
	@IsEmail()
	contactEmail?: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	contactTags?: string[];

	@IsOptional()
	@IsString()
	contactNotes?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	contactLastMessageAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	contactLastReplyAt?: Date;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deletedAt?: Date;
}
