/**
 * Single source of truth for Mongoose model names.
 * Used both for `MongooseModule.forFeature([{ name, schema }])` registration
 * and for `@InjectModel(name)` injection tokens. Values are the Pascal-singular
 * convention that the cross-collection `ref` strings in the schemas use.
 */
export const MODEL = {
  MEMBER: 'Member',
  DEVICE: 'Device',
  CONTACT: 'Contact',
  CAMPAIGN: 'Campaign',
  CAMPAIGN_RECIPIENT: 'CampaignRecipient',
  SMS_LOG: 'SmsLog',
  SESSION: 'Session',
  SUBSCRIPTION: 'Subscription',
} as const;
