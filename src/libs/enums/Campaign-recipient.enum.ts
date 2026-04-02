export const CampaignRecipientStatus = {
	PENDING: 'PENDING',
	SENT: 'SENT',
	FAILED: 'FAILED',
	SKIPPED: 'SKIPPED',
	CANCELLED: 'CANCELLED',
} as const;

export type CampaignRecipientStatusValue =
	(typeof CampaignRecipientStatus)[keyof typeof CampaignRecipientStatus];

export const CAMPAIGN_RECIPIENT_STATUS_VALUES: CampaignRecipientStatusValue[] =
	Object.values(CampaignRecipientStatus);
