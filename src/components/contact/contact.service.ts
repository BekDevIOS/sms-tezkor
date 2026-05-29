import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppException } from '../../common/app.exception';
import { Contact, Contacts } from '../../libs/dto/contact/contact';
import { ContactsInquiry, CreateContactDto, UpdateContactDto } from '../../libs/dto/contact/contact.input';
import { Direction, Message } from '../../libs/enums/common';
import { MODEL } from '../../libs/types/model-names';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(MODEL.CONTACT) private readonly contactModel: Model<any>,
    @InjectModel(MODEL.MEMBER) private readonly memberModel: Model<any>,
  ) {}

  async create(memberId: string, input: CreateContactDto): Promise<Contact> {
    const contact = await this.contactModel.create({
      memberId: new Types.ObjectId(memberId),
      name: input.name,
      phone: input.phone,
      status: input.status,
      tags: input.tags ?? [],
    });
    await this.memberModel.updateOne({ _id: memberId }, { $inc: { memberContacts: 1 } });
    return contact.toObject() as Contact;
  }

  async getContacts(memberId: string, inquiry: ContactsInquiry): Promise<Contacts> {
    const filter: Record<string, unknown> = {
      memberId: new Types.ObjectId(memberId),
    };
    if (inquiry.search?.status) filter.status = inquiry.search.status;
    if (inquiry.search?.text) {
      const re = new RegExp(inquiry.search.text, 'i');
      filter.$or = [{ name: re }, { phone: re }];
    }

    const sortField = inquiry.sort ?? 'createdAt';
    const sortDir = inquiry.direction === Direction.ASC ? 1 : -1;

    const [list, total] = await Promise.all([
      this.contactModel
        .find(filter)
        .sort({ [sortField]: sortDir })
        .skip((inquiry.page - 1) * inquiry.limit)
        .limit(inquiry.limit)
        .lean(),
      this.contactModel.countDocuments(filter),
    ]);
    return { list: list as Contact[], total };
  }

  async getContact(memberId: string, id: string): Promise<Contact> {
    const contact = await this.contactModel.findOne({ _id: id, memberId: new Types.ObjectId(memberId) }).lean();
    if (!contact) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.CONTACT_NOT_FOUND);
    }
    return contact as Contact;
  }

  async update(memberId: string, id: string, input: UpdateContactDto): Promise<Contact> {
    const contact = await this.contactModel
      .findOneAndUpdate({ _id: id, memberId: new Types.ObjectId(memberId) }, { $set: input }, { new: true })
      .lean();
    if (!contact) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.CONTACT_NOT_FOUND);
    }
    return contact as Contact;
  }

  async remove(memberId: string, id: string): Promise<{ success: boolean }> {
    const res = await this.contactModel.deleteOne({
      _id: id,
      memberId: new Types.ObjectId(memberId),
    });
    if (res.deletedCount === 0) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.CONTACT_NOT_FOUND);
    }
    await this.memberModel.updateOne({ _id: memberId, memberContacts: { $gt: 0 } }, { $inc: { memberContacts: -1 } });
    return { success: true };
  }
}
