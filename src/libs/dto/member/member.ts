import { Type } from 'class-transformer';
import {
	IsDate,
	IsEmail,
	IsEnum,
	IsInt,
	IsMongoId,
	IsOptional,
	IsString,
} from 'class-validator';
import { MemberAuthType, MemberRole, MemberStatus } from '../../enums/member.enum';

export class MemberDto {
	@IsMongoId()
	_id!: string;

	@IsEnum(MemberStatus)
	memberStatus!: MemberStatus;

	@IsEnum(MemberRole)
	memberRole!: MemberRole;

	@IsEnum(MemberAuthType)
	memberAuthType!: MemberAuthType;

	@IsEmail()
	memberEmail!: string;

	@IsOptional()
	@IsString()
	memberPhone?: string;

	@IsString()
	memberFirstName!: string;

	@IsOptional()
	@IsString()
	memberLastName?: string;

	@IsOptional()
	@IsString()
	memberCompanyName?: string;

	@IsOptional()
	@IsString()
	memberImage?: string;

	@Type(() => Number)
	@IsInt()
	memberDevices!: number;

	@Type(() => Number)
	@IsInt()
	memberContacts!: number;

	@Type(() => Number)
	@IsInt()
	memberCampaigns!: number;

	@Type(() => Number)
	@IsInt()
	memberSentSms!: number;

	@Type(() => Number)
	@IsInt()
	memberFailedSms!: number;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	deletedAt?: Date;

	@Type(() => Date)
	@IsDate()
	createdAt!: Date;

	@Type(() => Date)
	@IsDate()
	updatedAt!: Date;
}
