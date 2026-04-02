export const UserStatus = {
	ACTIVE: 'ACTIVE',
	BLOCKED: 'BLOCKED',
	DELETED: 'DELETED',
} as const;

export type UserStatusValue = (typeof UserStatus)[keyof typeof UserStatus];

export const USER_STATUS_VALUES: UserStatusValue[] = Object.values(UserStatus);

export const UserRole = {
	OWNER: 'OWNER',
	ADMIN: 'ADMIN',
	MANAGER: 'MANAGER',
} as const;

export type UserRoleValue = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLE_VALUES: UserRoleValue[] = Object.values(UserRole);

export const UserAuthType = {
	EMAIL: 'EMAIL',
	PHONE: 'PHONE',
} as const;

export type UserAuthTypeValue = (typeof UserAuthType)[keyof typeof UserAuthType];

export const USER_AUTH_TYPE_VALUES: UserAuthTypeValue[] =
	Object.values(UserAuthType);
