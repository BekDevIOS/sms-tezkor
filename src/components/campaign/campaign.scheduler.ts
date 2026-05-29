import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { CampaignStatus } from '../../libs/enums/campaign.enum';
import { DispatchService } from '../../dispatch/dispatch.service';
import { MODEL } from '../../libs/types/model-names';

@Injectable()
export class CampaignScheduler {
  private readonly logger = new Logger(CampaignScheduler.name);
  private isRunning = false;

  constructor(
    @InjectModel(MODEL.CAMPAIGN) private readonly campaignModel: Model<any>,
    private readonly dispatchService: DispatchService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async tick(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    try {
      await this.activateDueCampaigns();
      await this.sweepSendingCampaigns();
      await this.dispatchService.resetStuckProcessing();
    } catch (err) {
      this.logger.error('Scheduler tick failed', err as Error);
    } finally {
      this.isRunning = false;
    }
  }

  /** SCHEDULED campaigns whose time has come -> activate. */
  private async activateDueCampaigns(): Promise<void> {
    const due = await this.campaignModel
      .find({
        status: CampaignStatus.SCHEDULED,
        scheduledAt: { $lte: new Date() },
      })
      .select('_id')
      .lean();
    for (const c of due) {
      await this.dispatchService.activateCampaign(c._id);
    }
  }

  /** SENDING campaigns -> (re)assign to newly-online devices and finish when done. */
  private async sweepSendingCampaigns(): Promise<void> {
    const sending = await this.campaignModel
      .find({ status: CampaignStatus.SENDING })
      .lean();
    for (const c of sending) {
      await this.dispatchService.assignRecipients(c);
      await this.dispatchService.checkCampaignDone(c._id);
    }
  }
}
