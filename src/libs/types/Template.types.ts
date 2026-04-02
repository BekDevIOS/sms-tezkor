import type { Types } from 'mongoose';

export interface Template {
	userId: Types.ObjectId;
	templateName: string;
	templateCategory: string;
	templateContent: string;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
