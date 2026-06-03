import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppException } from '../../common/app.exception';
import { ContactGroup } from '../../libs/dto/contact-group/contact-group';
import { CreateContactGroupDto, UpdateContactGroupDto } from '../../libs/dto/contact-group/contact-group.input';
import { MODEL } from '../../libs/types/model-names';

@Injectable()
export class ContactGroupService {
  constructor(
    @InjectModel(MODEL.CONTACT_GROUP) private readonly groupModel: Model<any>,
    @InjectModel(MODEL.CONTACT) private readonly contactModel: Model<any>,
  ) {}

  async list(memberId: string): Promise<ContactGroup[]> {
    const memberObjectId = new Types.ObjectId(memberId);
    const [groups, counts] = await Promise.all([
      this.groupModel.find({ memberId: memberObjectId }).sort({ name: 1 }).lean(),
      this.contactModel.aggregate([
        { $match: { memberId: memberObjectId } },
        { $unwind: '$groupIds' },
        { $group: { _id: '$groupIds', n: { $sum: 1 } } },
      ]),
    ]);
    const countByGroup = new Map<string, number>(
      counts.map((c: { _id: Types.ObjectId; n: number }) => [String(c._id), c.n]),
    );
    return groups.map((group) => ({
      ...group,
      count: countByGroup.get(String(group._id)) ?? 0,
    })) as ContactGroup[];
  }

  async create(memberId: string, input: CreateContactGroupDto): Promise<ContactGroup> {
    try {
      const group = await this.groupModel.create({ ...input, memberId: new Types.ObjectId(memberId) });
      return group.toObject() as ContactGroup;
    } catch (err: any) {
      if (err?.code === 11000) throw new AppException(HttpStatus.BAD_REQUEST, 'Contact group name already exists');
      throw err;
    }
  }

  async update(memberId: string, id: string, input: UpdateContactGroupDto): Promise<ContactGroup> {
    const group = await this.groupModel
      .findOneAndUpdate({ _id: id, memberId: new Types.ObjectId(memberId) }, { $set: input }, { new: true })
      .lean();
    if (!group) throw new AppException(HttpStatus.NOT_FOUND, 'Contact group not found');
    return group as ContactGroup;
  }

  async remove(memberId: string, id: string): Promise<{ success: boolean }> {
    const memberObjectId = new Types.ObjectId(memberId);
    const groupObjectId = new Types.ObjectId(id);
    const result = await this.groupModel.deleteOne({ _id: groupObjectId, memberId: memberObjectId });
    if (!result.deletedCount) throw new AppException(HttpStatus.NOT_FOUND, 'Contact group not found');
    await this.contactModel.updateMany({ memberId: memberObjectId }, { $pull: { groupIds: groupObjectId } });
    return { success: true };
  }
}
