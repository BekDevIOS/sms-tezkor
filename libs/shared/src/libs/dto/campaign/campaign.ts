import { CampaignStatus } from '../../enums/campaign.enum';

export class Campaign {
  _id: string;
  memberId: string;
  title: string;
  message: string;
  status: CampaignStatus;
  scheduledAt?: Date;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CampaignProgress {
  pending: number;
  processing: number;
  sent: number;
  failed: number;
}

export class CampaignDetail extends Campaign {
  progress: CampaignProgress;
}

export class Campaigns {
  list: Campaign[];
  total: number;
}
