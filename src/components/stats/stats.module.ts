import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL } from '../../libs/types/model-names';
import CampaignSchema from '../../schemas/Campaign.model';
import DeviceSchema from '../../schemas/Device.model';
import MemberSchema from '../../schemas/Member.model';
import SmsLogSchema from '../../schemas/Sms-log.model';
import SubscriptionSchema from '../../schemas/Subscription.model';
import { AuthModule } from '../auth/auth.module';
import { AdminStatsController } from './admin.controller';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL.MEMBER, schema: MemberSchema },
      { name: MODEL.CAMPAIGN, schema: CampaignSchema },
      { name: MODEL.DEVICE, schema: DeviceSchema },
      { name: MODEL.SMS_LOG, schema: SmsLogSchema },
      { name: MODEL.SUBSCRIPTION, schema: SubscriptionSchema },
    ]),
    AuthModule,
  ],
  controllers: [StatsController, AdminStatsController],
  providers: [StatsService],
})
export class StatsModule {}
