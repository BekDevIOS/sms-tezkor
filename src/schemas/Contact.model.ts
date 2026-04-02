import { Schema } from 'mongoose';
import {
	CONTACT_STATUS_VALUES,
	ContactStatus,
} from '../libs/enums/Contact.enum';

const ContactSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		groupIds: [
			{
				type: Schema.Types.ObjectId,
				ref: 'ContactGroup',
			},
		],

		contactStatus: {
			type: String,
			enum: CONTACT_STATUS_VALUES,
			default: ContactStatus.NEW,
			index: true,
		},

		contactFullName: {
			type: String,
			trim: true,
			default: '',
		},
		contactPhone: {
			type: String,
			required: true,
			trim: true,
		},
		contactEmail: {
			type: String,
			trim: true,
			lowercase: true,
			default: '',
		},
		contactTags: {
			type: [String],
			default: [],
		},
		contactNotes: {
			type: String,
			default: '',
		},
		contactLastMessageAt: {
			type: Date,
		},
		contactLastReplyAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'contacts' },
);

ContactSchema.index({ userId: 1, contactPhone: 1 }, { unique: true });

export default ContactSchema;