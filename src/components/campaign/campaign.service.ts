import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppException } from '../../common/app.exception';
import { Campaign, CampaignDetail, Campaigns } from '../../libs/dto/campaign/campaign';
import { CampaignsInquiry, CreateCampaignDto } from '../../libs/dto/campaign/campaign.input';
import { CampaignStatus } from '../../libs/enums/campaign.enum';
import { CampaignRecipientStatus } from '../../libs/enums/campaign-recipient.enum';
import { Direction, Message } from '../../libs/enums/common';
import { MODEL } from '../../libs/types/model-names';
import { DispatchService } from '../../dispatch/dispatch.service';
import { ContactStatus } from '../../libs/enums/contact.enum';
import { DeviceStatus } from '../../libs/enums/device.enum';
import { findUnsupportedVariables, hasNameVariable, renderMessageTemplate } from '../../libs/utils/message-template';
import { normalizePhone } from '../../libs/utils/phone';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(MODEL.CAMPAIGN) private readonly campaignModel: Model<any>,
    @InjectModel(MODEL.CAMPAIGN_RECIPIENT)
    private readonly recipientModel: Model<any>,
    @InjectModel(MODEL.CONTACT) private readonly contactModel: Model<any>,
    @InjectModel(MODEL.CONTACT_GROUP) private readonly groupModel: Model<any>,
    @InjectModel(MODEL.MEMBER) private readonly memberModel: Model<any>,
    private readonly dispatchService: DispatchService,
  ) {}

  async create(memberId: string, input: CreateCampaignDto): Promise<Campaign | CampaignDetail> {
    const memberObjectId = new Types.ObjectId(memberId);

    // Build recipient seeds from contacts (ownership-checked) and raw phones.
    const seeds = new Map<string, { phone: string; message: string; contactId?: Types.ObjectId }>();
    const requiresName = hasNameVariable(input.message);
    const unsupportedVariables = findUnsupportedVariables(input.message);
    if (unsupportedVariables.length) {
      throw new AppException(HttpStatus.BAD_REQUEST, `Unsupported message variables: ${unsupportedVariables.join(', ')}`);
    }

    let contactIds = input.contactIds ?? [];
    if (input.groupIds?.length) {
      const groupIds = [...new Set(input.groupIds)];
      const ownedGroupCount = await this.groupModel.countDocuments({
        _id: { $in: groupIds.map((id) => new Types.ObjectId(id)) },
        memberId: memberObjectId,
      });
      if (ownedGroupCount !== groupIds.length) {
        throw new AppException(HttpStatus.BAD_REQUEST, 'One or more contact groups not found or not owned by you');
      }
      const groupedContacts = await this.contactModel
        .find({ memberId: memberObjectId, status: ContactStatus.ACTIVE, groupIds: { $in: groupIds } })
        .select('_id')
        .lean();
      contactIds = [...new Set([...contactIds, ...groupedContacts.map((contact) => String(contact._id))])];
    }

    if (contactIds.length) {
      const contacts = await this.contactModel
        .find({
          _id: { $in: contactIds.map((id) => new Types.ObjectId(id)) },
          memberId: memberObjectId,
          status: ContactStatus.ACTIVE,
        })
        .select('_id name phone')
        .lean();
      if (contacts.length !== contactIds.length) {
        throw new AppException(HttpStatus.BAD_REQUEST, Message.CONTACTS_NOT_OWNED);
      }
      for (const c of contacts) {
        const phone = normalizePhone(c.phone);
        if (!phone) {
          throw new AppException(HttpStatus.BAD_REQUEST, `Invalid Uzbekistan or South Korea phone number: ${c.phone}`);
        }
        if (requiresName && !c.name?.trim()) {
          throw new AppException(HttpStatus.BAD_REQUEST, `Contact ${c.phone} is missing a name required by {{name}}`);
        }
        seeds.set(phone, {
          phone,
          contactId: c._id,
          message: renderMessageTemplate(input.message, { ...c, phone }),
        });
      }
    }

    if (input.phones?.length) {
      if (requiresName) {
        throw new AppException(HttpStatus.BAD_REQUEST, '{{name}} can only be used with saved contacts');
      }
      for (const phone of input.phones) {
        const normalized = normalizePhone(phone);
        if (!normalized) {
          throw new AppException(HttpStatus.BAD_REQUEST, `Invalid Uzbekistan or South Korea phone number: ${phone}`);
        }
        seeds.set(normalized, {
          phone: normalized,
          message: renderMessageTemplate(input.message, { phone: normalized }),
        });
      }
    }

    if (seeds.size === 0) {
      throw new AppException(HttpStatus.BAD_REQUEST, Message.CAMPAIGN_NO_RECIPIENTS);
    }

    const pairedDevices = await this.dispatchService.getAvailableSenderDevices(memberObjectId);
    let senderDeviceId: Types.ObjectId;
    if (input.deviceId) {
      const selected = pairedDevices.find((device) => String(device._id) === input.deviceId);
      if (!selected || selected.status === DeviceStatus.BLOCKED) {
        throw new AppException(HttpStatus.BAD_REQUEST, 'Selected sender device is not available');
      }
      senderDeviceId = selected._id;
    } else if (pairedDevices.length === 1) {
      senderDeviceId = pairedDevices[0]._id;
    } else if (pairedDevices.length === 0) {
      throw new AppException(HttpStatus.BAD_REQUEST, 'Pair an Android sender device before creating a campaign');
    } else {
      throw new AppException(HttpStatus.BAD_REQUEST, 'Choose which device should send this campaign');
    }

    const initialStatus = input.scheduledAt ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT;

    const campaign = await this.campaignModel.create({
      memberId: memberObjectId,
      title: input.title,
      message: input.message,
      senderDeviceId,
      status: initialStatus,
      scheduledAt: input.scheduledAt,
      totalCount: seeds.size,
    });

    await this.recipientModel.insertMany(
      [...seeds.values()].map((s) => ({
        campaignId: campaign._id,
        contactId: s.contactId,
        phone: s.phone,
        message: s.message,
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
