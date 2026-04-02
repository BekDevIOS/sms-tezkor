export const IncomingMessageStatus = {
	UNREAD: 'UNREAD',
	READ: 'READ',
} as const;

export type IncomingMessageStatusValue =
	(typeof IncomingMessageStatus)[keyof typeof IncomingMessageStatus];

export const INCOMING_MESSAGE_STATUS_VALUES: IncomingMessageStatusValue[] =
	Object.values(IncomingMessageStatus);
