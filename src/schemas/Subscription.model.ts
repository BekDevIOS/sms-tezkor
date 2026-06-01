import { Schema } from 'mongoose';
import {
  SubscriptionPlan,
  SubscriptionStatus,
} from '../libs/enums/subscription.enum';

const SubscriptionSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: SubscriptionPlan,
      required: true,
    },
    status: {
      type: String,
      enum: SubscriptionStatus,
      default: SubscriptionStatus.ACTIVE,
      index: true,
    },
    startsAt: {
      type: Date,
      default: Date.now,
    },
    // null / undefined => no expiry (open-ended subscription)
    expiresAt: {
      type: Date,
    },
    // Max devices the member may pair; null/undefined => unlimited.
    deviceLimit: {
      type: Number,
      min: 0,
    },
    // Daily outbound quota in Uzbekistan local time; null / undefined => unlimited.
    dailySmsLimit: {
      type: Number,
      min: 1,
    },
    note: {
      type: String,
      trim: true,
    },
    // Admin (member) who activated this subscription.
    activatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
  },
  { timestamps: true, collection: 'subscriptions' },
);

SubscriptionSchema.index({ memberId: 1, status: 1 });

export default SubscriptionSchema;
