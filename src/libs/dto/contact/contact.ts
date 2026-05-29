import { ContactStatus } from '../../enums/contact.enum';

export class Contact {
  _id: string;
  memberId: string;
  name?: string;
  phone: string;
  status: ContactStatus;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class Contacts {
  list: Contact[];
  total: number;
}
