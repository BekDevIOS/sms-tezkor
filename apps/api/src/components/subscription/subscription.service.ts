import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppException } from '@app/shared/common/app.exception';
import {
  Subscription,
  Subscriptions,
} from '@app/shared/libs/dto/subscription/subscription';
import {
  ActivateSubscriptionDto,
  SubscriptionsInquiry,
} from '@app/shared/libs/dto/subscription/subscription.input';
import { Message } from '@app/shared/libs/enums/common';
import { SubscriptionStatus } from '@app/shared/libs/enums/subscription.enum';
import { MODEL } from '@app/shared/libs/types/model-names';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(MODEL.SUBSCRIPTION)
    private readonly subscriptionModel: Model<any>,
    @InjectModel(MODEL.MEMBER) private readonly memberModel: Model<any>,
  ) {}

  /**
   * Returns the member's active, non-expired subscription, or null.
   * Lazily flips an active-but-expired row to EXPIRED.
   */
  async getActiveForMember(memberId: string): Promise<any | null> {
    const sub = await this.subscriptionModel
      .findOne({
        memberId: new Types.ObjectId(memberId),
        status: SubscriptionStatus.ACTIVE,
      })
      .sort({ createdAt: -1 });
    if (!sub) return null;
    if (sub.expiresAt && new Date(sub.expiresAt).getTime() <= Date.now()) {
      sub.status = SubscriptionStatus.EXPIRED;
      await sub.save();
      return null;
    }
    return sub;
  }

  isActive(memberId: string): Promise<boolean> {
    return this.getActiveForMember(memberId).then((s) => !!s);
  }

  /** Member views their own current/most-recent subscription. */
  async getMine(memberId: string): Promise<Subscription | null> {
    const active = await this.getActiveForMember(memberId);
    if (active) return active.toObject() as Subscription;
    const latest = await this.subscriptionModel
      .findOne({ memberId: new Types.ObjectId(memberId) })
      .sort({ createdAt: -1 })
      .lean();
    return (latest as Subscription) ?? null;
  }

  /** Admin: activate a subscription for a member (supersedes any active one). */
  async activate(
    memberId: string,
    input: ActivateSubscriptionDto,
    adminId: string,
  ): Promise<Subscription> {
    const member = await this.memberModel.findById(memberId).select('_id').lean();
    if (!member) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.MEMBER_NOT_FOUND);
    }

    // Only one ACTIVE subscription at a time — supersede the previous.
    await this.subscriptionModel.updateMany(
      {
        memberId: new Types.ObjectId(memberId),
        status: SubscriptionStatus.ACTIVE,
      },
      { $set: { status: SubscriptionStatus.CANCELLED } },
    );

    const startsAt = new Date();
    const expiresAt = input.durationDays
      ? new Date(startsAt.getTime() + input.durationDays * 24 * 60 * 60 * 1000)
      : undefined;

    const created = await this.subscriptionModel.create({
      memberId: new Types.ObjectId(memberId),
      plan: input.plan,
      status: SubscriptionStatus.ACTIVE,
      startsAt,
      expiresAt,
      note: input.note,
      activatedBy: new Types.ObjectId(adminId),
    });
    return created.toObject() as Subscription;
  }

  /** Admin: cancel a subscription by id. */
  async cancel(id: string): Promise<Subscription> {
    const sub = await this.subscriptionModel
      .findByIdAndUpdate(
        id,
        { $set: { status: SubscriptionStatus.CANCELLED } },
        { new: true },
      )
      .lean();
    if (!sub) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        Message.SUBSCRIPTION_NOT_FOUND,
      );
    }
    return sub as Subscription;
  }

  /** Admin: list subscriptions. */
  async list(inquiry: SubscriptionsInquiry): Promise<Subscriptions> {
    const filter: Record<string, unknown> = {};
    if (inquiry.status) filter.status = inquiry.status;

    const [list, total] = await Promise.all([
      this.subscriptionModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((inquiry.page - 1) * inquiry.limit)
        .limit(inquiry.limit)
        .lean(),
      this.subscriptionModel.countDocuments(filter),
    ]);
    return { list: list as Subscription[], total };
  }
}
