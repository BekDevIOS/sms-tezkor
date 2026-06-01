import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppException } from '../../common/app.exception';
import { AutoReplies, AutoReply } from '../../libs/dto/auto-reply/auto-reply';
import {
  AutoRepliesInquiry,
  CreateAutoReplyDto,
  UpdateAutoReplyDto,
} from '../../libs/dto/auto-reply/auto-reply.input';
import { Direction, Message } from '../../libs/enums/common';
import { MODEL } from '../../libs/types/model-names';
import { escapeRegex } from '../../libs/utils/regex';

@Injectable()
export class AutoReplyService {
  constructor(
    @InjectModel(MODEL.AUTO_REPLY) private readonly autoReplyModel: Model<any>,
    @InjectModel(MODEL.DEVICE) private readonly deviceModel: Model<any>,
  ) {}

  async create(memberId: string, input: CreateAutoReplyDto): Promise<AutoReply> {
    await this.assertDeviceOwned(memberId, input.deviceId);
    const doc = await this.autoReplyModel.create({
      memberId: new Types.ObjectId(memberId),
      triggerText: input.triggerText,
      replyBody: input.replyBody,
      matchType: input.matchType,
      enabled: input.enabled,
      deviceId: input.deviceId ? new Types.ObjectId(input.deviceId) : undefined,
      status: input.status,
    });
    return doc.toObject() as AutoReply;
  }

  async getList(memberId: string, inquiry: AutoRepliesInquiry): Promise<AutoReplies> {
    const filter: Record<string, unknown> = { memberId: new Types.ObjectId(memberId) };
    if (inquiry.search?.status) filter.status = inquiry.search.status;
    if (typeof inquiry.search?.enabled === 'boolean') filter.enabled = inquiry.search.enabled;
    if (inquiry.search?.text) {
      const safe = escapeRegex(inquiry.search.text.trim());
      filter.$or = [
        { triggerText: { $regex: safe, $options: 'i' } },
        { replyBody: { $regex: safe, $options: 'i' } },
      ];
    }

    const sortField = inquiry.sort ?? 'createdAt';
    const sortDir = inquiry.direction === Direction.ASC ? 1 : -1;

    const [list, total] = await Promise.all([
      this.autoReplyModel
        .find(filter)
        .sort({ [sortField]: sortDir })
        .skip((inquiry.page - 1) * inquiry.limit)
        .limit(inquiry.limit)
        .lean(),
      this.autoReplyModel.countDocuments(filter),
    ]);
    return { list: list as AutoReply[], total };
  }

  async getOne(memberId: string, id: string): Promise<AutoReply> {
    const doc = await this.autoReplyModel
      .findOne({ _id: id, memberId: new Types.ObjectId(memberId) })
      .lean();
    if (!doc) throw new AppException(HttpStatus.NOT_FOUND, Message.AUTO_REPLY_NOT_FOUND);
    return doc as AutoReply;
  }

  async update(memberId: string, id: string, input: UpdateAutoReplyDto): Promise<AutoReply> {
    await this.assertDeviceOwned(memberId, input.deviceId);
    const doc = await this.autoReplyModel
      .findOneAndUpdate({ _id: id, memberId: new Types.ObjectId(memberId) }, { $set: input }, { new: true })
      .lean();
    if (!doc) throw new AppException(HttpStatus.NOT_FOUND, Message.AUTO_REPLY_NOT_FOUND);
    return doc as AutoReply;
  }

  async remove(memberId: string, id: string): Promise<{ success: boolean }> {
    const res = await this.autoReplyModel.deleteOne({ _id: id, memberId: new Types.ObjectId(memberId) });
    if (res.deletedCount === 0) throw new AppException(HttpStatus.NOT_FOUND, Message.AUTO_REPLY_NOT_FOUND);
    return { success: true };
  }

  private async assertDeviceOwned(memberId: string, deviceId?: string): Promise<void> {
    if (!deviceId) return;
    const owned = await this.deviceModel.exists({
      _id: deviceId,
      memberId: new Types.ObjectId(memberId),
    });
    if (!owned) throw new AppException(HttpStatus.NOT_FOUND, Message.DEVICE_NOT_FOUND);
  }
}
