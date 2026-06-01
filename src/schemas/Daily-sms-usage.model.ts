import { Schema } from 'mongoose';

const DailySmsUsageSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    claimedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true, collection: 'daily_sms_usages' },
);

DailySmsUsageSchema.index({ memberId: 1, date: 1 }, { unique: true });

export default DailySmsUsageSchema;
