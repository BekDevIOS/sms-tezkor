export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 200;

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
