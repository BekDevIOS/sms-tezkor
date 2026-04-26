import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsMongoId, IsString, MinLength } from 'class-validator';
import { SessionOwnerType } from '../../enums/session.enum';

export class SessionInputDto {
	@IsMongoId()
	ownerId!: string;

	@IsEnum(SessionOwnerType)
	type!: SessionOwnerType;

	@IsString()
	@MinLength(1)
	token!: string;

	@Type(() => Date)
	@IsDate()
	expiresAt!: Date;
}
