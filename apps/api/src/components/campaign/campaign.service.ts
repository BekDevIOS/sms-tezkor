import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppException } from '@app/shared/common/app.exception';
import { Campaign, CampaignDetail, Campaigns } from '@app/shared/libs/dto/campaign/campaign';
import { CampaignsInquiry, CreateCampaignDto } from '@app/shared/libs/dto/campaign/campaign.input';
import { CampaignStatus } from '@app/shared/libs/enums/campaign.enum';
import { CampaignRecipientStatus } from '@app/shared/libs/enums/campaign-recipient.enum';
import { Direction, Message } from '@app/shared/libs/enums/common';
import { MODEL } from '@app/shared/libs/types/model-names';
import { DispatchService } from '@app/shared/dispatch/dispatch.service';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(MODEL.CAMPAIGN) private readonly campaignModel: Model<any>,
    @InjectModel(MODEL.CAMPAIGN_RECIPIENT)
    private readonly recipientModel: Model<any>,
    @InjectModel(MODEL.CONTACT) private readonly contactModel: Model<any>,
    @InjectModel(MODEL.MEMBER) private readonly memberModel: Model<any>,
    private readonly dispatchService: DispatchService,
  ) {}

  async create(memberId: string, input: CreateCampaignDto): Promise<Campaign | CampaignDetail> {
    const memberObjectId = new Types.ObjectId(memberId);

    // Build recipient seeds from contacts (ownership-checked) and raw phones.
    const seeds: { phone: string; contactId?: Types.ObjectId }[] = [];

    if (input.contactIds?.length) {
      const contacts = await this.contactModel
        .find({
          _id: { $in: input.contactIds.map((id) => new Types.ObjectId(id)) },
          memberId: memberObjectId,
        })
        .select('_id phone')
        .lean();
      if (contacts.length !== input.contactIds.length) {
        throw new AppException(HttpStatus.BAD_REQUEST, Message.CONTACTS_NOT_OWNED);
      }
      for (const c of contacts) {
        seeds.push({ phone: c.phone, contactId: c._id });
      }
    }

    if (input.phones?.length) {
      for (const phone of input.phones) {
        seeds.push({ phone: phone.trim() });
      }
    }

    if (seeds.length === 0) {
      throw new AppException(HttpStatus.BAD_REQUEST, Message.CAMPAIGN_NO_RECIPIENTS);
    }

    const initialStatus = input.scheduledAt ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT;

    const campaign = await this.campaignModel.create({
      memberId: memberObjectId,
      title: input.title,
      message: input.message,
      status: initialStatus,
      scheduledAt: input.scheduledAt,
      totalCount: seeds.length,
    });

    await this.recipientModel.insertMany(
      seeds.map((s) => ({
        campaignId: campaign._id,
        contactId: s.contactId,
        phone: s.phone,
        status: CampaignRecipientStatus.PENDING,
        attempts: 0,
      })),
    );

    await this.memberModel.updateOne({ _id: memberObjectId }, { $inc: { memberCampaigns: 1 } });

    if (input.sendNow) {
      await this.dispatchService.activateCampaign(campaign._id);
      return this.getCampaign(memberId, String(campaign._id));
    }

    return campaign.toObject() as Campaign;
  }

  async getCampaigns(memberId: string, inquiry: CampaignsInquiry): Promise<Campaigns> {
    const filter: Record<string, unknown> = {
      memberId: new Types.ObjectId(memberId),
    };
    if (inquiry.status) filter.status = inquiry.status;

    const sortField = inquiry.sort ?? 'createdAt';
    const sortDir = inquiry.direction === Direction.ASC ? 1 : -1;

    const [list, total] = await Promise.all([
      this.campaignModel
        .find(filter)
        .sort({ [sortField]: sortDir })
        .skip((inquiry.page - 1) * inquiry.limit)
        .limit(inquiry.limit)
        .lean(),
      this.campaignModel.countDocuments(filter),
    ]);
    return { list: list as Campaign[], total };
  }

  async getCampaign(memberId: string, id: string): Promise<CampaignDetail> {
    const campaign = await this.campaignModel.findOne({ _id: id, memberId: new Types.ObjectId(memberId) }).lean();
    if (!campaign) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.CAMPAIGN_NOT_FOUND);
    }

    const grouped = await this.recipientModel.aggregate([
      { $match: { campaignId: campaign._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const progress = { pending: 0, processing: 0, sent: 0, failed: 0 };
    for (const g of grouped) {
      if (g._id === CampaignRecipientStatus.PENDING) progress.pending = g.count;
      else if (g._id === CampaignRecipientStatus.PROCESSING) progress.processing = g.count;
      else if (g._id === CampaignRecipientStatus.SENT) progress.sent = g.count;
      else if (g._id === CampaignRecipientStatus.FAILED) progress.failed = g.count;
    }
    return { ...(campaign as Campaign), progress };
  }

  async cancel(memberId: string, id: string): Promise<CampaignDetail> {
    const campaign = await this.campaignModel.findOne({ _id: id, memberId: new Types.ObjectId(memberId) }).lean();
    if (!campaign) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.CAMPAIGN_NOT_FOUND);
    }
    if (campaign.status === CampaignStatus.DONE) {
      throw new AppException(HttpStatus.BAD_REQUEST, Message.CAMPAIGN_ALREADY_FINISHED);
    }

    // MVP has no CANCELLED enum: mark remaining work FAILED and finish the campaign.
    await this.recipientModel.updateMany(
      {
        campaignId: campaign._id,
        status: {
          $in: [CampaignRecipientStatus.PENDING, CampaignRecipientStatus.PROCESSING],
        },
      },
      {
        $set: {
          status: CampaignRecipientStatus.FAILED,
          failReason: 'campaign_cancelled',
        },
      },
    );
    await this.campaignModel.updateOne({ _id: campaign._id }, { $set: { status: CampaignStatus.DONE } });
    return this.getCampaign(memberId, id);
  }
}
