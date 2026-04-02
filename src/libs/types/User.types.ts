import type { Types } from 'mongoose';
import type {
	UserAuthTypeValue,
	UserRoleValue,
	UserStatusValue,
} from '../enums/User.enum';

export interface User {
	userStatus: UserStatusValue;
	userRole: UserRoleValue;
	userAuthType: UserAuthTypeValue;
	userEmail?: string;
	userPhone?: string;
	userPassword: string;
	userFullName: string;
	userCompanyName: string;
	userImage: string;
	userDevices: number;
	userContacts: number;
	userCampaigns: number;
	userSentSms: number;
	userFailedSms: number;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

/** User fields as returned to clients (no password). */
export type UserPublic = Omit<User, 'userPassword'> & { _id: Types.ObjectId };
