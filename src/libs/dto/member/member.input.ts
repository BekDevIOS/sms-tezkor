import { Type } from 'class-transformer';
import {
  IsEmail,
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
import { availableMemberSort } from '../../config';
import { Direction } from '../../enums/common';
import { MemberRole, MemberStatus } from '../../enums/member.enum';

export class RegisterInput {
  @IsEmail()
  memberEmail: string;

  @IsString()
  @MinLength(8)
  memberPassword: string;

  @IsString()
  @MinLength(1)
  memberFirstName: string;

  @IsOptional()
  @IsString()
  memberLastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  memberPhone?: string;

  @IsOptional()
  @IsString()
  memberCompanyName?: string;
}

export class LoginInput {
  @IsEmail()
  memberEmail: string;

  @IsString()
  @MinLength(1)
  memberPassword: string;
}

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  memberFirstName?: string;

  @IsOptional()
  @IsString()
  memberLastName?: string;

  @IsOptional()
  @IsString()
  memberPhone?: string;

  @IsOptional()
  @IsString()
  memberCompanyName?: string;

  @IsOptional()
  @IsString()
  memberImage?: string;
}

/**
 * Admin-only update. Deliberately separate from UpdateMemberDto so a member can
 * never set their own role/status via the self-service /member/me endpoint
 * (whitelist + forbidNonWhitelisted strips unknown fields).
 */
export class AdminUpdateMemberDto {
  @IsOptional()
  @IsEnum(MemberStatus)
  memberStatus?: MemberStatus;

  @IsOptional()
  @IsEnum(MemberRole)
  memberRole?: MemberRole;
}

export class MemberSearch {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  text?: string;

  @IsOptional()
  @IsEnum(MemberStatus)
  memberStatus?: MemberStatus;

  @IsOptional()
  @IsEnum(MemberRole)
  memberRole?: MemberRole;
}

export class MembersInquiry {
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
  @IsIn(availableMemberSort)
  sort?: (typeof availableMemberSort)[number];

  @IsOptional()
  @IsEnum(Direction)
  direction?: Direction;

  @IsOptional()
  @Type(() => MemberSearch)
  search?: MemberSearch;
}
