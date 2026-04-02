import type { Types } from 'mongoose';
import type { ContactStatusValue } from '../enums/Contact.enum';

export interface Contact {
	userId: Types.ObjectId;
	groupIds: Types.ObjectId[];
	contactStatus: ContactStatusValue;
	contactFullName: string;
	contactPhone: string;
	contactEmail: string;
	contactTags: string[];
	contactNotes: string;
	contactLastMessageAt?: Date;
	contactLastReplyAt?: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
