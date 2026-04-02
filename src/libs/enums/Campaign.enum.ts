export const CampaignType = {
	INSTANT: 'INSTANT',
	SCHEDULED: 'SCHEDULED',
} as const;

export type CampaignTypeValue = (typeof CampaignType)[keyof typeof CampaignType];

export const CAMPAIGN_TYPE_VALUES: CampaignTypeValue[] =
	Object.values(CampaignType);

export const CampaignStatus = {
	DRAFT: 'DRAFT',
	SCHEDULED: 'SCHEDULED',
	PROCESSING: 'PROCESSING',
	PAUSED: 'PAUSED',
	COMPLETED: 'COMPLETED',
	FAILED: 'FAILED',
	CANCELLED: 'CANCELLED',
} as const;

export type CampaignStatusValue =
	(typeof CampaignStatus)[keyof typeof CampaignStatus];

export const CAMPAIGN_STATUS_VALUES: CampaignStatusValue[] =
	Object.values(CampaignStatus);

export const CampaignSenderMode = {
	DEVICE: 'DEVICE',
} as const;

export type CampaignSenderModeValue =
	(typeof CampaignSenderMode)[keyof typeof CampaignSenderMode];

export const CAMPAIGN_SENDER_MODE_VALUES: CampaignSenderModeValue[] =
	Object.values(CampaignSenderMode);
