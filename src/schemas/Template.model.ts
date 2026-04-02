import { Schema } from 'mongoose';

const TemplateSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		templateName: {
			type: String,
			required: true,
			trim: true,
		},
		templateCategory: {
			type: String,
			default: '',
		},
		templateContent: {
			type: String,
			required: true,
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'templates' },
);

export default TemplateSchema;