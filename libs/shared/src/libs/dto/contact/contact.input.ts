import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { availableContactSort } from '../../config';
import { ContactStatus } from '../../enums/contact.enum';
import { Direction } from '../../enums/common';

export class CreateContactDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsString()
  @MinLength(1)
  phone: string;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateContactDto {
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

export class CISearch {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  text?: string;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}

export class ContactsInquiry {
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
  @IsIn(availableContactSort)
  sort?: (typeof availableContactSort)[number];

  @IsOptional()
  @IsEnum(Direction)
  direction?: Direction;

  @IsOptional()
  @Type(() => CISearch)
  search?: CISearch;
}
