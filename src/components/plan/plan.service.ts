import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppException } from '../../common/app.exception';
import { Plan } from '../../libs/dto/plan/plan';
import { UpdatePlanDto } from '../../libs/dto/plan/plan.input';
import { Message } from '../../libs/enums/common';
import { SubscriptionPlan } from '../../libs/enums/subscription.enum';
import { MODEL } from '../../libs/types/model-names';

/**
 * Default catalog seeded on first boot. SMS is unlimited on every tier; the
 * tiers differ by throughput. MVP plans all use one sender. Prices start empty (negotiated) so the admin
 * fills them in. Admins can override any of this at runtime via the admin API.
 */
const PLAN_DEFAULTS: Array<Partial<Plan> & { code: SubscriptionPlan }> = [
  {
    code: SubscriptionPlan.BASIC,
    name: 'Basic',
    price: null,
    dailySmsLimit: null, // cheksiz
    deviceLimit: 1,
    durationDays: 30,
    features: [],
    order: 1,
  },
  {
    code: SubscriptionPlan.PRO,
    name: 'Pro',
    price: null,
    dailySmsLimit: null,
    deviceLimit: 1,
    durationDays: 30,
    features: [],
    order: 2,
  },
  {
    code: SubscriptionPlan.ENTERPRISE,
    name: 'Enterprise',
    price: null,
    dailySmsLimit: null,
    deviceLimit: 1,
    durationDays: 30,
    features: [],
    order: 3,
  },
];

@Injectable()
export class PlanService implements OnModuleInit {
  constructor(
    @InjectModel(MODEL.PLAN) private readonly planModel: Model<any>,
  ) {}

  /** Seed any missing default plans without clobbering admin edits. */
  async onModuleInit(): Promise<void> {
    await Promise.all(
      PLAN_DEFAULTS.map((def) =>
        this.planModel.updateOne(
          { code: def.code },
          { $setOnInsert: def },
          { upsert: true },
        ),
      ),
    );
  }

  /** Active plans for members to view (sorted by display order). */
  async listActive(): Promise<Plan[]> {
    return this.planModel.find({ isActive: true }).sort({ order: 1 }).lean() as Promise<Plan[]>;
  }

  /** All plans for the admin catalog editor. */
  async listAll(): Promise<Plan[]> {
    return this.planModel.find().sort({ order: 1 }).lean() as Promise<Plan[]>;
  }

  async getByCode(code: SubscriptionPlan): Promise<Plan | null> {
    return this.planModel.findOne({ code }).lean() as Promise<Plan | null>;
  }

  /** Admin: patch a plan by its code. */
  async update(code: SubscriptionPlan, input: UpdatePlanDto): Promise<Plan> {
    // Drop undefined keys so we never $set them; null IS kept (clears the field).
    const patch: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) patch[key] = value;
    }

    const updated = await this.planModel
      .findOneAndUpdate({ code }, { $set: patch }, { new: true })
      .lean();
    if (!updated) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.PLAN_NOT_FOUND);
    }
    return updated as Plan;
  }
}
