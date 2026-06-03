export class ContactGroup {
  _id: string;
  memberId: string;
  name: string;
  description?: string;
  color: string;
  /** Number of contacts in this group (computed in list()). */
  count?: number;
  createdAt: Date;
  updatedAt: Date;
}
