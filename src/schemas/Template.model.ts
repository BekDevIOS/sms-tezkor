import { Schema } from 'mongoose';
import { TemplateStatus } from '../libs/enums/template.enum';

const TemplateSchema = new Schema(
	{
		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
			index: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		body: {
			type: String,
			required: true,
		},
		variables: {
			type: [String],
			default: [],
		},
		locale: {
			type: String,
			trim: true,
		},
		status: {
			type: String,
			enum: TemplateStatus,
			default: TemplateStatus.ACTIVE,
			index: true,
		},
	},
	{ timestamps: true, collection: 'templates' },
);

TemplateSchema.index({ memberId: 1, createdAt: -1 });

export default TemplateSchema;
