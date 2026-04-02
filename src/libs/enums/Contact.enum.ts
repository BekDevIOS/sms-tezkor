export const ContactStatus = {
	NEW: 'NEW',
	CONTACTED: 'CONTACTED',
	INTERESTED: 'INTERESTED',
	CONVERTED: 'CONVERTED',
	REJECTED: 'REJECTED',
} as const;

export type ContactStatusValue =
	(typeof ContactStatus)[keyof typeof ContactStatus];

export const CONTACT_STATUS_VALUES: ContactStatusValue[] =
	Object.values(ContactStatus);
