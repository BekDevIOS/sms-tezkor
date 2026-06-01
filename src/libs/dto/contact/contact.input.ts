import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayMaxSize,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
  IsMongoId,
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

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  groupIds?: string[];
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

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  groupIds?: string[];
}

export class ImportContactRowDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  @MinLength(1)
  phone: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class ImportContactsDto {
  @IsArray()
  @ArrayMaxSize(5000)
  @ValidateNested({ each: true })
  @Type(() => ImportContactRowDto)
  rows: ImportContactRowDto[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  groupIds?: string[];
}

export class CISearch {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  text?: string;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @IsMongoId()
  groupId?: string;
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
