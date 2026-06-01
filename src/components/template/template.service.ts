import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppException } from '../../common/app.exception';
import { Template, Templates } from '../../libs/dto/template/template';
import {
  CreateTemplateDto,
  TemplatesInquiry,
  UpdateTemplateDto,
} from '../../libs/dto/template/template.input';
import { Direction, Message } from '../../libs/enums/common';
import { MODEL } from '../../libs/types/model-names';
import { escapeRegex } from '../../libs/utils/regex';

@Injectable()
export class TemplateService {
  constructor(@InjectModel(MODEL.TEMPLATE) private readonly templateModel: Model<any>) {}

  async create(memberId: string, input: CreateTemplateDto): Promise<Template> {
    const doc = await this.templateModel.create({
      memberId: new Types.ObjectId(memberId),
      name: input.name,
      body: input.body,
      variables: input.variables ?? [],
      locale: input.locale,
      status: input.status,
    });
    return doc.toObject() as Template;
  }

  async getList(memberId: string, inquiry: TemplatesInquiry): Promise<Templates> {
    const filter: Record<string, unknown> = { memberId: new Types.ObjectId(memberId) };
    if (inquiry.search?.status) filter.status = inquiry.search.status;
    if (inquiry.search?.text) {
      const safe = escapeRegex(inquiry.search.text.trim());
      filter.$or = [
        { name: { $regex: safe, $options: 'i' } },
        { body: { $regex: safe, $options: 'i' } },
      ];
    }

    const sortField = inquiry.sort ?? 'createdAt';
    const sortDir = inquiry.direction === Direction.ASC ? 1 : -1;

    const [list, total] = await Promise.all([
      this.templateModel
        .find(filter)
        .sort({ [sortField]: sortDir })
        .skip((inquiry.page - 1) * inquiry.limit)
        .limit(inquiry.limit)
        .lean(),
      this.templateModel.countDocuments(filter),
    ]);
    return { list: list as Template[], total };
  }

  async getOne(memberId: string, id: string): Promise<Template> {
    const doc = await this.templateModel
      .findOne({ _id: id, memberId: new Types.ObjectId(memberId) })
      .lean();
    if (!doc) throw new AppException(HttpStatus.NOT_FOUND, Message.TEMPLATE_NOT_FOUND);
    return doc as Template;
  }

  async update(memberId: string, id: string, input: UpdateTemplateDto): Promise<Template> {
    const doc = await this.templateModel
      .findOneAndUpdate({ _id: id, memberId: new Types.ObjectId(memberId) }, { $set: input }, { new: true })
      .lean();
    if (!doc) throw new AppException(HttpStatus.NOT_FOUND, Message.TEMPLATE_NOT_FOUND);
    return doc as Template;
  }

  async remove(memberId: string, id: string): Promise<{ success: boolean }> {
    const res = await this.templateModel.deleteOne({ _id: id, memberId: new Types.ObjectId(memberId) });
    if (res.deletedCount === 0) throw new AppException(HttpStatus.NOT_FOUND, Message.TEMPLATE_NOT_FOUND);
    return { success: true };
  }
}
