export const SmsJobType = {
	SEND_SMS: 'SEND_SMS',
} as const;

export type SmsJobTypeValue = (typeof SmsJobType)[keyof typeof SmsJobType];

export const SMS_JOB_TYPE_VALUES: SmsJobTypeValue[] = Object.values(SmsJobType);

export const SmsJobStatus = {
	WAITING: 'WAITING',
	ACTIVE: 'ACTIVE',
	COMPLETED: 'COMPLETED',
	FAILED: 'FAILED',
	CANCELLED: 'CANCELLED',
} as const;

export type SmsJobStatusValue = (typeof SmsJobStatus)[keyof typeof SmsJobStatus];

export const SMS_JOB_STATUS_VALUES: SmsJobStatusValue[] =
	Object.values(SmsJobStatus);
