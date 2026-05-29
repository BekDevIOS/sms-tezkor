import {
  SubscriptionPlan,
  SubscriptionStatus,
} from '../../enums/subscription.enum';

export class Subscription {
  _id: string;
  memberId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startsAt: Date;
  expiresAt?: Date;
  note?: string;
  activatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Subscriptions {
  list: Subscription[];
  total: number;
}
