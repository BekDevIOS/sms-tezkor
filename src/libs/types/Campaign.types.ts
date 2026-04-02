import type { Types } from 'mongoose';
import type {
	CampaignSenderModeValue,
	CampaignStatusValue,
	CampaignTypeValue,
} from '../enums/Campaign.enum';

export interface CampaignOptions {
	allowReplyTracking: boolean;
	useRandomDelay: boolean;
	minDelaySec: number;
	maxDelaySec: number;
	batchSize: number;
	batchPauseSec: number;
}

export interface Campaign {
	userId: Types.ObjectId;
	deviceIds: Types.ObjectId[];
	campaignType: CampaignTypeValue;
	campaignStatus: CampaignStatusValue;
	campaignSenderMode: CampaignSenderModeValue;
	campaignTitle: string;
	campaignMessage: string;
	campaignScheduledAt?: Date;
	campaignStartedAt?: Date;
	campaignCompletedAt?: Date;
	campaignTotalRecipients: number;
	campaignSentCount: number;
	campaignFailedCount: number;
	campaignPendingCount: number;
	campaignOptions: CampaignOptions;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
