import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsMongoId, IsString, MinLength } from 'class-validator';
import { SessionOwnerType } from '../../enums/session.enum';

export class SessionUpdateDto {
	@IsOptional()
	@IsMongoId()
	ownerId?: string;

	@IsOptional()
	@IsEnum(SessionOwnerType)
	type?: SessionOwnerType;

	@IsOptional()
	@IsString()
	@MinLength(1)
	token?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	expiresAt?: Date;
}
