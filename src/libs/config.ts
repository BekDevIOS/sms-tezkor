export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 200;

/**
 * TezkorSMS MVP intentionally supports one Android sender per account.
 * Keep device references in the data model so multi-device can be enabled later
 * without a destructive migration.
 */
export const MVP_DEVICE_LIMIT = 1;

export const availableContactSort = ['createdAt', 'name', 'phone'] as const;
export const availableCampaignSort = [
  'createdAt',
  'title',
  'status',
  'scheduledAt',
] as const;
export const availableDeviceSort = [
  'createdAt',
  'name',
  'status',
  'lastSeenAt',
] as const;
export const availableSmsLogSort = ['createdAt', 'status', 'phone'] as const;
export const availableMemberSort = [
  'createdAt',
  'memberEmail',
  'memberStatus',
  'memberRole',
] as const;
export const availableTemplateSort = ['createdAt', 'name', 'status'] as const;
export const availableAutoReplySort = ['createdAt', 'triggerText', 'status'] as const;

/**
 * Per-plan defaults. Used to derive a device's throughput and a member's device
 * cap when the admin did not set an explicit `deviceLimit` on the subscription.
 * `deviceLimit: null` => unlimited.
 * NOTE: per-plan `maxAttempts` is intentionally NOT wired into dispatch yet —
 * that touches the hot dispatch query path and is deferred.
 */
export const PLAN_LIMITS = {
  BASIC: { sendLimitPerMinute: 30, maxAttempts: 2, deviceLimit: 1 },
  PRO: { sendLimitPerMinute: 120, maxAttempts: 3, deviceLimit: 1 },
  ENTERPRISE: { sendLimitPerMinute: 500, maxAttempts: 5, deviceLimit: 1 },
} as const;
