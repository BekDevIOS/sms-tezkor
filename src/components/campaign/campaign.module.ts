import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import CampaignSchema from '../../schemas/Campaign.model';
import CampaignRecipientSchema from '../../schemas/Campaign-recipient.model';
import ContactSchema from '../../schemas/Contact.model';
import ContactGroupSchema from '../../schemas/Contact-group.model';
import MemberSchema from '../../schemas/Member.model';
import { MODEL } from '../../libs/types/model-names';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { DispatchModule } from '../../dispatch/dispatch.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL.CAMPAIGN, schema: CampaignSchema },
      { name: MODEL.CAMPAIGN_RECIPIENT, schema: CampaignRecipientSchema },
      { name: MODEL.CONTACT, schema: ContactSchema },
      { name: MODEL.CONTACT_GROUP, schema: ContactGroupSchema },
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
