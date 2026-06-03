export enum Direction {
  ASC = 'asc',
  DESC = 'desc',
}

export enum Message {
  SOMETHING_WENT_WRONG = 'Something went wrong!',
  BAD_REQUEST = 'Bad request!',
  NO_DATA_FOUND = 'No data found!',
  NOT_ALLOWED_REQUEST = 'Not allowed request!',

  // Auth
  TOKEN_NOT_EXIST = 'Bearer token is not provided!',
  NOT_AUTHENTICATED = 'Invalid or expired session!',
  INVALID_CREDENTIALS = 'Invalid credentials!',
  EMAIL_ALREADY_EXISTS = 'Email is already registered!',
  ACCOUNT_BLOCKED = 'Account is blocked!',

  // Member
  MEMBER_NOT_FOUND = 'Member not found!',
  CANNOT_MODIFY_OWNER = 'You are not allowed to modify an owner account!',
  CANNOT_PROMOTE_TO_OWNER = 'Promoting a member to owner is not allowed!',
  CANNOT_MODIFY_SELF = 'You cannot change your own role or status!',

  // Contact
  CONTACT_NOT_FOUND = 'Contact not found!',

  // Campaign
  CAMPAIGN_NOT_FOUND = 'Campaign not found!',
  CAMPAIGN_ALREADY_FINISHED = 'Campaign is already finished!',
  CAMPAIGN_NO_RECIPIENTS = 'Campaign has no recipients!',
  CONTACTS_NOT_OWNED = 'One or more contacts not found or not owned by you!',

  // Device
  DEVICE_NOT_FOUND = 'Device not found!',
  INVALID_DEVICE_CODE = 'Invalid device code!',
  DEVICE_LIMIT_REACHED = 'Device limit reached for your subscription!',

  // Subscription
  SUBSCRIPTION_REQUIRED = 'An active subscription is required. Please contact the administrator.',
  SUBSCRIPTION_NOT_FOUND = 'Subscription not found!',

  // Template
  TEMPLATE_NOT_FOUND = 'Template not found!',

  // Auto-reply
  AUTO_REPLY_NOT_FOUND = 'Auto-reply rule not found!',

  // Plan
  PLAN_NOT_FOUND = 'Plan not found!',
}
