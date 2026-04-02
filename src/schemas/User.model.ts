import { Schema } from 'mongoose';
import {
	USER_AUTH_TYPE_VALUES,
	USER_ROLE_VALUES,
	USER_STATUS_VALUES,
	UserAuthType,
	UserRole,
	UserStatus,
} from '../libs/enums/User.enum';

const UserSchema = new Schema(
	{
		userStatus: {
			type: String,
			enum: USER_STATUS_VALUES,
			default: UserStatus.ACTIVE,
		},
		userRole: {
			type: String,
			enum: USER_ROLE_VALUES,
			default: UserRole.OWNER,
		},
		userAuthType: {
			type: String,
			enum: USER_AUTH_TYPE_VALUES,
			default: UserAuthType.EMAIL,
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