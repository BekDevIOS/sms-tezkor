import { Type } from 'class-transformer';
import {
	IsDate,
	IsEmail,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Min,
	MinLength,
} from 'class-validator';
import { MemberAuthType, MemberRole, MemberStatus } from '../../enums/member.enum';

export class MemberUpdateDto {
	@IsOptional()
	@IsEnum(MemberStatus)
	memberStatus?: MemberStatus;

	@IsOptional()
	@IsEnum(MemberRole)
	memberRole?: MemberRole;

	@IsOptional()
	@IsEnum(MemberAuthType)
	memberAuthType?: MemberAuthType;

	@IsOptional()
	@IsEmail()
	memberEmail?: string;

	@IsOptional()
	@IsString()
	@MinLength(1)
	memberPhone?: string;

	@IsOptional()
	@IsString()
	@MinLength(8)
	memberPassword?: string;

	@IsOptional()
	@IsString()
	@MinLength(1)
	memberFirstName?: string;

	@IsOptional()
	@IsString()
	memberLastName?: string;

	@IsOptional()
	@IsString()
	memberCompanyName?: string;

	@IsOptional()
	@IsString()
	memberImage?: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	memberDevices?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	memberContacts?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	memberCampaigns?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	memberSentSms?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	memberFailedSms?: number;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deletedAt?: Date | null;
}
