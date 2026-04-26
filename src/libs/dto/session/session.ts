import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsMongoId, IsString } from 'class-validator';
import { SessionOwnerType } from '../../enums/session.enum';

export class SessionDto {
	@IsMongoId()
	_id!: string;

	@IsMongoId()
	ownerId!: string;

	@IsEnum(SessionOwnerType)
	type!: SessionOwnerType;

	@IsString()
	token!: string;

	@Type(() => Date)
	@IsDate()
	expiresAt!: Date;

	@Type(() => Date)
	@IsDate()
	createdAt!: Date;

	@Type(() => Date)
	@IsDate()
	updatedAt!: Date;
}
