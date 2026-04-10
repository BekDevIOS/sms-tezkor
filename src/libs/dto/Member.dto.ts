import { Type } from 'class-transformer';
import {
	IsDate,
	IsEmail,
	IsIn,
	IsInt,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';
import {
	MEMBER_AUTH_TYPE_VALUES,
	MEMBER_ROLE_VALUES,
	MEMBER_STATUS_VALUES,
	type MemberAuthTypeValue,
	type MemberRoleValue,
	type MemberStatusValue,
} from '../enums/Member.enum';

export class CreateMemberDto {
	@IsOptional()
	@IsIn(MEMBER_STATUS_VALUES)
	userStatus?: MemberStatusValue;

	@IsOptional()
	@IsIn(MEMBER_ROLE_VALUES)
	userRole?: MemberRoleValue;

	@IsOptional()
	@IsIn(MEMBER_AUTH_TYPE_VALUES)
	userAuthType?: MemberAuthTypeValue;

	@IsOptional()
	@IsEmail()
	userEmail?: string;

	@IsOptional()
	@IsString()
	userPhone?: string;

	@IsString()
	userPassword!: string;

	@IsString()
	userFullName!: string;

	@IsOptional()
	@IsString()
	userCompanyName?: string;

	@IsOptional()
	@IsString()
	userImage?: string;

	@IsOptional()
	@IsInt()
	@Min(0)
	userDevices?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	userContacts?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	userCampaigns?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	userSentSms?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	userFailedSms?: number;
}

export class UpdateMemberDto {
	@IsOptional()
	@IsIn(MEMBER_STATUS_VALUES)
	userStatus?: MemberStatusValue;

	@IsOptional()
	@IsIn(MEMBER_ROLE_VALUES)
	userRole?: MemberRoleValue;

	@IsOptional()
	@IsIn(MEMBER_AUTH_TYPE_VALUES)
	userAuthType?: MemberAuthTypeValue;

	@IsOptional()
	@IsEmail()
	userEmail?: string;

	@IsOptional()
	@IsString()
	userPhone?: string;

	@IsOptional()
	@IsString()
	userPassword?: string;

	@IsOptional()
	@IsString()
	userFullName?: string;

	@IsOptional()
	@IsString()
	userCompanyName?: string;

	@IsOptional()
	@IsString()
	userImage?: string;

	@IsOptional()
	@IsInt()
	@Min(0)
	userDevices?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	userContacts?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	userCampaigns?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	userSentSms?: number;

	@IsOptional()
	@IsInt()
	@Min(0)
	userFailedSms?: number;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deletedAt?: Date;
}
