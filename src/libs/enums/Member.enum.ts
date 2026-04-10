export const MemberStatus = {
	ACTIVE: 'ACTIVE',
	BLOCKED: 'BLOCKED',
	DELETED: 'DELETED',
} as const;

export type MemberStatusValue =
	(typeof MemberStatus)[keyof typeof MemberStatus];

export const MEMBER_STATUS_VALUES: MemberStatusValue[] =
	Object.values(MemberStatus);

export const MemberRole = {
	OWNER: 'OWNER',
	ADMIN: 'ADMIN',
	USER: 'USER',
} as const;

export type MemberRoleValue = (typeof MemberRole)[keyof typeof MemberRole];

export const MEMBER_ROLE_VALUES: MemberRoleValue[] = Object.values(MemberRole);

export const MemberAuthType = {
	EMAIL: 'EMAIL',
	PHONE: 'PHONE',
} as const;

export type MemberAuthTypeValue =
	(typeof MemberAuthType)[keyof typeof MemberAuthType];

export const MEMBER_AUTH_TYPE_VALUES: MemberAuthTypeValue[] =
	Object.values(MemberAuthType);
