import type { Types } from 'mongoose';

export interface ContactGroup {
	userId: Types.ObjectId;
	groupName: string;
	groupDesc: string;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
