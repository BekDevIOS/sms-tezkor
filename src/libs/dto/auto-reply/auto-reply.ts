import { AutoReplyMatchType, AutoReplyStatus } from '../../enums/auto-reply.enum';

export class AutoReply {
  _id: string;
  memberId: string;
  triggerText: string;
  replyBody: string;
  matchType: AutoReplyMatchType;
  enabled: boolean;
  deviceId?: string;
  status: AutoReplyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class AutoReplies {
  list: AutoReply[];
  total: number;
}
