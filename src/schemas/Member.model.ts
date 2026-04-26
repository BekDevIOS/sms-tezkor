import { Schema } from 'mongoose';
import { MemberAuthType, MemberRole, MemberStatus } from '../libs/enums/member.enum';

const MemberSchema = new Schema(
	{
		memberStatus: {
			type: String,
			enum: MemberStatus,
			default: MemberStatus.ACTIVE,
		},
		memberRole: {
			type: String,
			enum: MemberRole,
			default: MemberRole.USER,
		},
		memberAuthType: {
			type: String,
			enum: MemberAuthType,
			default: MemberAuthType.EMAIL,
		},

		memberEmail: {
			type: String,
			index: { unique: true, sparse: true },
			trim: true,
			lowercase: true,
			required: true,
		},
		memberPhone: {
			type: String,
			index: { unique: true, sparse: true },
			trim: true,
		},
		memberPassword: {
			type: String,
			select: false,
			required: true,
		},
		memberFirstName: {
			type: String,
			required: true,
			trim: true,
		},
		memberLastName: {
			type: String,
			trim: true,
		},
		memberCompanyName: {
			type: String,
			trim: true,
		},
		memberImage: {
			type: String,
		},

		memberDevices: {
			type: Number,
			default: 0,
		},
		memberContacts: {
			type: Number,
			default: 0,
		},
		memberCampaigns: {
			type: Number,
			default: 0,
		},
		memberSentSms: {
			type: Number,
			default: 0,
		},
		memberFailedSms: {
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
