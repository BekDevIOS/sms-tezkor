export const SmsLogDirection = {
	OUTGOING: 'OUTGOING',
} as const;

export type SmsLogDirectionValue =
	(typeof SmsLogDirection)[keyof typeof SmsLogDirection];

export const SMS_LOG_DIRECTION_VALUES: SmsLogDirectionValue[] =
	Object.values(SmsLogDirection);

export const SmsLogStatus = {
	SENT: 'SENT',
	FAILED: 'FAILED',
	DELIVERED: 'DELIVERED',
} as const;

export type SmsLogStatusValue = (typeof SmsLogStatus)[keyof typeof SmsLogStatus];

export const SMS_LOG_STATUS_VALUES: SmsLogStatusValue[] =
	Object.values(SmsLogStatus);
