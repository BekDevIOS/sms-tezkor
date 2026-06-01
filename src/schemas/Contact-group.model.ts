import { Schema } from 'mongoose';

const ContactGroupSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
      default: '#4d8cff',
    },
  },
  { timestamps: true, collection: 'contact_groups' },
);

ContactGroupSchema.index({ memberId: 1, name: 1 }, { unique: true });

export default ContactGroupSchema;
