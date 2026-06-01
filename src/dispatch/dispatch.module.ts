import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CampaignSchema from '../schemas/Campaign.model';
import CampaignRecipientSchema from '../schemas/Campaign-recipient.model';
import DeviceSchema from '../schemas/Device.model';
import MemberSchema from '../schemas/Member.model';
import SmsLogSchema from '../schemas/Sms-log.model';
import SubscriptionSchema from '../schemas/Subscription.model';
import DailySmsUsageSchema from '../schemas/Daily-sms-usage.model';
import { MODEL } from '../libs/types/model-names';
import { DispatchService } from './dispatch.service';

/**
 * Shared dispatch engine: recipient assignment, atomic claim/report, counters.
 * Consumed by the API (campaign sendNow, device jobs/report) and the batch
 * scheduler. Registered once and exported so both apps reuse the same logic.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL.CAMPAIGN, schema: CampaignSchema },
      { name: MODEL.CAMPAIGN_RECIPIENT, schema: CampaignRecipientSchema },
      { name: MODEL.DEVICE, schema: DeviceSchema },
      { name: MODEL.MEMBER, schema: MemberSchema },
      { name: MODEL.SMS_LOG, schema: SmsLogSchema },
      { name: MODEL.SUBSCRIPTION, schema: SubscriptionSchema },
      { name: MODEL.DAILY_SMS_USAGE, schema: DailySmsUsageSchema },
    ]),
  ],
  providers: [DispatchService],
  exports: [DispatchService, MongooseModule],
})
export class DispatchModule {}
