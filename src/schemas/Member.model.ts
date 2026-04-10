import { Schema } from 'mongoose';
import {
	MEMBER_AUTH_TYPE_VALUES,
	MEMBER_ROLE_VALUES,
	MEMBER_STATUS_VALUES,
	MemberAuthType,
	MemberRole,
	MemberStatus,
} from '../libs/enums/Member.enum';

const MemberSchema = new Schema(
	{
		userStatus: {
			type: String,
			enum: MEMBER_STATUS_VALUES,
			default: MemberStatus.ACTIVE,
		},
		userRole: {
			type: String,
			enum: MEMBER_ROLE_VALUES,
			default: MemberRole.OWNER,
		},
		userAuthType: {
			type: String,
			enum: MEMBER_AUTH_TYPE_VALUES,
			default: MemberAuthType.EMAIL,
		},

		userEmail: {
			type: String,
			index: { unique: true, sparse: true },
			trim: true,
			lowercase: true,
		},
		userPhone: {
			type: String,
			index: { unique: true, sparse: true },
			trim: true,
		},
		userPassword: {
			type: String,
			select: false,
			required: true,
		},
		userFullName: {
			type: String,
			required: true,
			trim: true,
		},
		userCompanyName: {
			type: String,
			trim: true,
			default: '',
		},
		userImage: {
			type: String,
			default: '',
		},

		userDevices: {
			type: Number,
			default: 0,
		},
		userContacts: {
			type: Number,
			default: 0,
		},
		userCampaigns: {
			type: Number,
			default: 0,
		},
		userSentSms: {
			type: Number,
			default: 0,
		},
		userFailedSms: {
			type: Number,
			default: 0,
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'members' },
);

export default MemberSchema;
