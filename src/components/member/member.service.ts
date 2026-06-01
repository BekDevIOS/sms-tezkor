import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppException } from '../../common/app.exception';
import { Member, Members } from '../../libs/dto/member/member';
import {
  AdminUpdateMemberDto,
  MembersInquiry,
  UpdateMemberDto,
} from '../../libs/dto/member/member.input';
import { Direction, Message } from '../../libs/enums/common';
import { MemberRole, MemberStatus } from '../../libs/enums/member.enum';
import { SessionOwnerType } from '../../libs/enums/session.enum';
import { MODEL } from '../../libs/types/model-names';
import { escapeRegex } from '../../libs/utils/regex';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(MODEL.MEMBER) private readonly memberModel: Model<any>,
    @InjectModel(MODEL.SESSION) private readonly sessionModel: Model<any>,
    @InjectModel(MODEL.DEVICE) private readonly deviceModel: Model<any>,
  ) {}

  async getMe(memberId: string): Promise<Member> {
    const member = await this.memberModel.findById(memberId).lean();
    if (!member) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.MEMBER_NOT_FOUND);
    }
    return member as Member;
  }

  async updateMe(memberId: string, input: UpdateMemberDto): Promise<Member> {
    const member = await this.memberModel.findByIdAndUpdate(memberId, { $set: input }, { new: true }).lean();
    if (!member) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.MEMBER_NOT_FOUND);
    }
    return member as Member;
  }

  // ----- Admin -----

  async listMembers(inquiry: MembersInquiry): Promise<Members> {
    const filter: Record<string, unknown> = {};
    if (inquiry.search?.memberStatus) filter.memberStatus = inquiry.search.memberStatus;
    if (inquiry.search?.memberRole) filter.memberRole = inquiry.search.memberRole;
    if (inquiry.search?.text) {
      const safe = escapeRegex(inquiry.search.text.trim());
      filter.$or = [
        { memberEmail: { $regex: safe, $options: 'i' } },
        { memberFirstName: { $regex: safe, $options: 'i' } },
        { memberLastName: { $regex: safe, $options: 'i' } },
        { memberCompanyName: { $regex: safe, $options: 'i' } },
      ];
    }

    const sortField = inquiry.sort ?? 'createdAt';
    const sortDir = inquiry.direction === Direction.ASC ? 1 : -1;

    const [list, total] = await Promise.all([
      this.memberModel
        .find(filter)
        .sort({ [sortField]: sortDir })
        .skip((inquiry.page - 1) * inquiry.limit)
        .limit(inquiry.limit)
        .lean(),
      this.memberModel.countDocuments(filter),
    ]);
    return { list: list as Member[], total };
  }

  async getMemberDetail(id: string): Promise<Member> {
    const member = await this.memberModel.findById(id).lean();
    if (!member) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.MEMBER_NOT_FOUND);
    }
    return member as Member;
  }

  async adminUpdate(actor: Member, id: string, input: AdminUpdateMemberDto): Promise<Member> {
    const target = await this.memberModel.findById(id).lean();
    if (!target) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.MEMBER_NOT_FOUND);
    }
    this.assertCanManage(actor, target as Member);

    if (input.memberRole === MemberRole.OWNER) {
      throw new AppException(HttpStatus.FORBIDDEN, Message.CANNOT_PROMOTE_TO_OWNER);
    }

    const updated = await this.memberModel
      .findByIdAndUpdate(id, { $set: input }, { new: true })
      .lean();
    if (input.memberStatus === MemberStatus.BLOCKED || input.memberStatus === MemberStatus.DELETED) {
      await this.revokeMemberAndDeviceSessions(id);
    }
    return updated as Member;
  }

  async softDelete(actor: Member, id: string): Promise<{ success: boolean }> {
    const target = await this.memberModel.findById(id).lean();
    if (!target) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.MEMBER_NOT_FOUND);
    }
    this.assertCanManage(actor, target as Member);

    await this.memberModel.updateOne(
      { _id: id },
      { $set: { memberStatus: MemberStatus.DELETED, deletedAt: new Date() } },
    );
    // Force logout: drop all of this member's sessions.
    await this.revokeMemberAndDeviceSessions(id);
    return { success: true };
  }

  private async revokeMemberAndDeviceSessions(memberId: string): Promise<void> {
    const memberObjectId = new Types.ObjectId(memberId);
    const devices = await this.deviceModel.find({ memberId: memberObjectId }).select('_id').lean();
    await this.sessionModel.deleteMany({
      $or: [
        { ownerId: memberObjectId, type: SessionOwnerType.MEMBER },
        { ownerId: { $in: devices.map((device) => device._id) }, type: SessionOwnerType.DEVICE },
      ],
    });
  }

  /** Guardrails: admins can't touch owners, can't touch themselves via admin API. */
  private assertCanManage(actor: Member, target: Member): void {
    if (String(actor._id) === String(target._id)) {
      throw new AppException(HttpStatus.FORBIDDEN, Message.CANNOT_MODIFY_SELF);
    }
    if (target.memberRole === MemberRole.OWNER) {
      throw new AppException(HttpStatus.FORBIDDEN, Message.CANNOT_MODIFY_OWNER);
    }
    // Only an OWNER may manage an ADMIN.
    if (target.memberRole === MemberRole.ADMIN && actor.memberRole !== MemberRole.OWNER) {
      throw new AppException(HttpStatus.FORBIDDEN, Message.CANNOT_MODIFY_OWNER);
    }
  }
}
