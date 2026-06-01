import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppException } from '../../common/app.exception';
import { Contact, Contacts } from '../../libs/dto/contact/contact';
import { ContactsInquiry, CreateContactDto, ImportContactsDto, UpdateContactDto } from '../../libs/dto/contact/contact.input';
import { Direction, Message } from '../../libs/enums/common';
import { MODEL } from '../../libs/types/model-names';
import { escapeRegex } from '../../libs/utils/regex';
import { normalizePhone } from '../../libs/utils/phone';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(MODEL.CONTACT) private readonly contactModel: Model<any>,
    @InjectModel(MODEL.MEMBER) private readonly memberModel: Model<any>,
    @InjectModel(MODEL.CONTACT_GROUP) private readonly groupModel: Model<any>,
  ) {}

  async create(memberId: string, input: CreateContactDto): Promise<Contact> {
    const phone = this.requirePhone(input.phone);
    await this.ensurePhoneAvailable(memberId, phone);
    await this.ensureGroupsOwned(memberId, input.groupIds);
    const contact = await this.contactModel.create({
      memberId: new Types.ObjectId(memberId),
      name: input.name,
      phone,
      status: input.status,
      tags: input.tags ?? [],
      groupIds: input.groupIds ?? [],
    });
    await this.memberModel.updateOne({ _id: memberId }, { $inc: { memberContacts: 1 } });
    return contact.toObject() as Contact;
  }

  async import(memberId: string, input: ImportContactsDto) {
    const memberObjectId = new Types.ObjectId(memberId);
    await this.ensureGroupsOwned(memberId, input.groupIds);
    const byPhone = new Map<string, { name?: string; phone: string; tags: string[] }>();
    const errors: { row: number; phone: string; reason: string }[] = [];

    input.rows.forEach((row, index) => {
      const phone = normalizePhone(row.phone);
      if (!phone) {
        errors.push({ row: index + 2, phone: row.phone, reason: 'Invalid Uzbekistan or South Korea phone number' });
        return;
      }
      byPhone.set(phone, {
        name: row.name?.trim() || undefined,
        phone,
        tags: row.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
      });
    });

    const rows = [...byPhone.values()];
    if (rows.length === 0) return { created: 0, updated: 0, errors };

    const existing = await this.contactModel
      .find({ memberId: memberObjectId, phone: { $in: rows.map((row) => row.phone) } })
      .select('phone')
      .lean();
    const existingPhones = new Set(existing.map((row) => row.phone));

    await this.contactModel.bulkWrite(
      rows.map((row) => ({
        updateOne: {
          filter: { memberId: memberObjectId, phone: row.phone },
          update: {
            $set: { name: row.name, tags: row.tags, status: 'ACTIVE', ...(input.groupIds ? { groupIds: input.groupIds } : {}) },
            $setOnInsert: { memberId: memberObjectId, phone: row.phone },
          },
          upsert: true,
        },
      })),
    );
    const created = rows.filter((row) => !existingPhones.has(row.phone)).length;
    await this.memberModel.updateOne({ _id: memberObjectId }, { $inc: { memberContacts: created } });
    return { created, updated: rows.length - created, errors };
  }

  async getContacts(memberId: string, inquiry: ContactsInquiry): Promise<Contacts> {
    const filter: Record<string, unknown> = {
      memberId: new Types.ObjectId(memberId),
    };
    if (inquiry.search?.status) filter.status = inquiry.search.status;
    if (inquiry.search?.groupId) filter.groupIds = new Types.ObjectId(inquiry.search.groupId);
    if (inquiry.search?.text) {
      const safe = escapeRegex(inquiry.search.text.trim());
      filter.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { phone: { $regex: safe, $options: 'i' } },
      ];
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
    const update = { ...input };
    await this.ensureGroupsOwned(memberId, input.groupIds);
    if (input.phone) {
      update.phone = this.requirePhone(input.phone);
      await this.ensurePhoneAvailable(memberId, update.phone, id);
    }
    const contact = await this.contactModel
      .findOneAndUpdate({ _id: id, memberId: new Types.ObjectId(memberId) }, { $set: update }, { new: true })
      .lean();
    if (!contact) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.CONTACT_NOT_FOUND);
    }
    return contact as Contact;
  }

  private async ensureGroupsOwned(memberId: string, groupIds?: string[]): Promise<void> {
    if (!groupIds?.length) return;
    const uniqueIds = [...new Set(groupIds)];
    const count = await this.groupModel.countDocuments({
      _id: { $in: uniqueIds.map((id) => new Types.ObjectId(id)) },
      memberId: new Types.ObjectId(memberId),
    });
    if (count !== uniqueIds.length) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'One or more contact groups not found or not owned by you');
    }
  }

  private requirePhone(phone: string): string {
    const normalized = normalizePhone(phone);
    if (!normalized) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'Invalid Uzbekistan or South Korea phone number');
    }
    return normalized;
  }

  private async ensurePhoneAvailable(memberId: string, phone: string, exceptId?: string): Promise<void> {
    const filter: Record<string, unknown> = { memberId: new Types.ObjectId(memberId), phone };
    if (exceptId) filter._id = { $ne: new Types.ObjectId(exceptId) };
    if (await this.contactModel.exists(filter)) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'Contact phone number already exists');
    }
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
