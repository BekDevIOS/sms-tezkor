import type { Types } from 'mongoose';
import type {
	MemberAuthTypeValue,
	MemberRoleValue,
	MemberStatusValue,
} from '../enums/Member.enum';

export interface Member {
	userStatus: MemberStatusValue;
	userRole: MemberRoleValue;
	userAuthType: MemberAuthTypeValue;
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

/** Member fields as returned to clients (no password). */
export type MemberPublic = Omit<Member, 'userPassword'> & {
	_id: Types.ObjectId;
};
