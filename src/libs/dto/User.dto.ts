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
	USER_AUTH_TYPE_VALUES,
	USER_ROLE_VALUES,
	USER_STATUS_VALUES,
	type UserAuthTypeValue,
	type UserRoleValue,
	type UserStatusValue,
} from '../enums/User.enum';

export class CreateUserDto {
	@IsOptional()
	@IsIn(USER_STATUS_VALUES)
	userStatus?: UserStatusValue;

	@IsOptional()
	@IsIn(USER_ROLE_VALUES)
	userRole?: UserRoleValue;

	@IsOptional()
	@IsIn(USER_AUTH_TYPE_VALUES)
	userAuthType?: UserAuthTypeValue;

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

export class UpdateUserDto {
	@IsOptional()
	@IsIn(USER_STATUS_VALUES)
	userStatus?: UserStatusValue;

	@IsOptional()
	@IsIn(USER_ROLE_VALUES)
	userRole?: UserRoleValue;

	@IsOptional()
	@IsIn(USER_AUTH_TYPE_VALUES)
	userAuthType?: UserAuthTypeValue;

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
