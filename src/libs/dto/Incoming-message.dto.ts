import { Type } from 'class-transformer';
import {
	IsDate,
	IsIn,
	IsMongoId,
	IsOptional,
	IsString,
} from 'class-validator';
import {
	INCOMING_MESSAGE_STATUS_VALUES,
	type IncomingMessageStatusValue,
} from '../enums/Incoming-message.enum';

export class CreateIncomingMessageDto {
	@IsMongoId()
	userId!: string;

	@IsMongoId()
	deviceId!: string;

	@IsOptional()
	@IsMongoId()
	matchedContactId?: string;

	@IsOptional()
	@IsMongoId()
	matchedCampaignId?: string;

	@IsOptional()
	@IsMongoId()
	matchedCampaignRecipientId?: string;

	@IsOptional()
	@IsIn(INCOMING_MESSAGE_STATUS_VALUES)
	messageStatus?: IncomingMessageStatusValue;

	@IsString()
	messageFromPhone!: string;

	@IsOptional()
	@IsString()
	messageToPhone?: string;

	@IsString()
	messageBody!: string;

	@Type(() => Date)
	@IsDate()
	messageReceivedAt!: Date;
}

export class UpdateIncomingMessageDto {
	@IsOptional()
	@IsMongoId()
	matchedContactId?: string;

	@IsOptional()
	@IsMongoId()
	matchedCampaignId?: string;

	@IsOptional()
	@IsMongoId()
	matchedCampaignRecipientId?: string;

	@IsOptional()
	@IsIn(INCOMING_MESSAGE_STATUS_VALUES)
	messageStatus?: IncomingMessageStatusValue;

	@IsOptional()
	@IsString()
	messageToPhone?: string;

	@IsOptional()
	@IsString()
	messageBody?: string;

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	messageReceivedAt?: Date;
}
