import { Schema } from 'mongoose';
import { ContactStatus } from '../libs/enums/contact.enum';

const ContactSchema = new Schema(
	{
		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
			index: true,
		},
		name: {
			type: String,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ContactStatus,
			default: ContactStatus.ACTIVE,
			index: true,
		},
		tags: {
			type: [String],
			default: [],
		},
		groupIds: {
			type: [{ type: Schema.Types.ObjectId, ref: 'ContactGroup' }],
			default: [],
			index: true,
		},
	},
	{ timestamps: true, collection: 'contacts' },
);

ContactSchema.index({ memberId: 1, phone: 1 });

export default ContactSchema;
