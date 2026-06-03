import { Schema } from 'mongoose';
import { SubscriptionPlan } from '../libs/enums/subscription.enum';

/**
 * Admin-editable plan catalog. The three rows (BASIC/PRO/ENTERPRISE) are the
 * marketing tiers shown to members; an admin tunes price/limits/duration here
 * at runtime. `null` on a limit means "unlimited"; `null` price means the price
 * is negotiated (shown as "Kelishuv asosida").
 */
const PlanSchema = new Schema(
  {
    code: {
      type: String,
      enum: SubscriptionPlan,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // null/undefined => negotiated price ("Kelishuv asosida")
    price: {
      type: Number,
      min: 0,
      default: null,
    },
    currency: {
      type: String,
      default: 'UZS',
      trim: true,
    },
    // null/undefined => unlimited daily SMS
    dailySmsLimit: {
      type: Number,
      min: 1,
      default: null,
    },
    // null/undefined => unlimited devices
    deviceLimit: {
      type: Number,
      min: 0,
      default: null,
    },
    // null/undefined => open-ended (no expiry)
    durationDays: {
      type: Number,
      min: 1,
      default: 30,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: 'plans' },
);

export default PlanSchema;
