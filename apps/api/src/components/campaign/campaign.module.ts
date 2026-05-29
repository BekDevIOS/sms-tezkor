import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CampaignSchema from '@app/shared/schemas/Campaign.model';
import CampaignRecipientSchema from '@app/shared/schemas/Campaign-recipient.model';
import ContactSchema from '@app/shared/schemas/Contact.model';
import MemberSchema from '@app/shared/schemas/Member.model';
import { MODEL } from '@app/shared/libs/types/model-names';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { DispatchModule } from '@app/shared/dispatch/dispatch.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL.CAMPAIGN, schema: CampaignSchema },
      { name: MODEL.CAMPAIGN_RECIPIENT, schema: CampaignRecipientSchema },
      { name: MODEL.CONTACT, schema: ContactSchema },
      { name: MODEL.MEMBER, schema: MemberSchema },
    ]),
    AuthModule,
    SubscriptionModule,
    DispatchModule,
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
