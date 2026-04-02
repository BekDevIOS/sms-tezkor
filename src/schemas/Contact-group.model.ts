import { Schema } from 'mongoose';

const ContactGroupSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		groupName: {
			type: String,
			required: true,
			trim: true,
		},
		groupDesc: {
			type: String,
			default: '',
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'contactGroups' },
);

export default ContactGroupSchema;