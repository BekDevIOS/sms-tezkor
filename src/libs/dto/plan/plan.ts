import { SubscriptionPlan } from '../../enums/subscription.enum';

export class Plan {
  _id: string;
  code: SubscriptionPlan;
  name: string;
  price: number | null;
  currency: string;
  dailySmsLimit: number | null;
  deviceLimit: number | null;
  durationDays: number | null;
  description: string;
  features: string[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
