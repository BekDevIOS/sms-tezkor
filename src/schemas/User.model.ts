import { Schema } from 'mongoose';

const UserSchema = new Schema(
	{
		userStatus: {
			type: String,
			enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
			default: 'ACTIVE',
		},
		userRole: {
			type: String,
			enum: ['OWNER', 'ADMIN', 'MANAGER'],
			default: 'OWNER',
		},
		userAuthType: {
			type: String,
			enum: ['EMAIL', 'PHONE'],
			default: 'EMAIL',
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
	{ timestamps: true, collection: 'users' },
);

export default UserSchema;