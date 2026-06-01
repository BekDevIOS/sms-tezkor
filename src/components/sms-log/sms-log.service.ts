import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SmsLogDto } from '../../libs/dto/sms-log/sms-log';
import { SmsLogs, SmsLogsInquiry } from '../../libs/dto/sms-log/sms-log.query';
import { Direction } from '../../libs/enums/common';
import { MODEL } from '../../libs/types/model-names';
import { escapeRegex } from '../../libs/utils/regex';

@Injectable()
export class SmsLogService {
  constructor(@InjectModel(MODEL.SMS_LOG) private readonly smsLogModel: Model<any>) {}

  /** Member-scoped logs. */
  getMine(memberId: string, inquiry: SmsLogsInquiry): Promise<SmsLogs> {
    return this.query(inquiry, new Types.ObjectId(memberId));
  }

  /** Admin: all logs, optionally filtered by search.memberId. */
  getAll(inquiry: SmsLogsInquiry): Promise<SmsLogs> {
    return this.query(inquiry, null);
  }

  private async query(inquiry: SmsLogsInquiry, memberId: Types.ObjectId | null): Promise<SmsLogs> {
    const filter: Record<string, unknown> = {};
    if (memberId) {
      filter.memberId = memberId;
    } else if (inquiry.search?.memberId) {
      filter.memberId = new Types.ObjectId(inquiry.search.memberId);
    }

    const search = inquiry.search;
    if (search?.status) filter.status = search.status;
    if (search?.campaignId) filter.campaignId = new Types.ObjectId(search.campaignId);
    if (search?.deviceId) filter.deviceId = new Types.ObjectId(search.deviceId);
    if (search?.text) {
      filter.phone = { $regex: escapeRegex(search.text.trim()), $options: 'i' };
    }
    if (search?.dateFrom || search?.dateTo) {
      const range: Record<string, Date> = {};
      if (search.dateFrom) range.$gte = search.dateFrom;
      if (search.dateTo) range.$lte = search.dateTo;
      filter.createdAt = range;
    }

    const sortField = inquiry.sort ?? 'createdAt';
    const sortDir = inquiry.direction === Direction.ASC ? 1 : -1;

    const [list, total] = await Promise.all([
      this.smsLogModel
        .find(filter)
        .sort({ [sortField]: sortDir })
        .skip((inquiry.page - 1) * inquiry.limit)
        .limit(inquiry.limit)
        .lean(),
      this.smsLogModel.countDocuments(filter),
    ]);
    return { list: list as SmsLogDto[], total };
  }
}
