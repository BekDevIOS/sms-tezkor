import { Schema } from 'mongoose';

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
			enum: ['NEW', 'CONTACTED', 'INTERESTED', 'CONVERTED', 'REJECTED'],
			default: 'NEW',
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