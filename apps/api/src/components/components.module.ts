import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CampaignModule } from './campaign/campaign.module';
import { ContactModule } from './contact/contact.module';
import { DeviceModule } from './device/device.module';
import { MemberModule } from './member/member.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    AuthModule,
    MemberModule,
    ContactModule,
    CampaignModule,
    DeviceModule,
    SubscriptionModule,
  ],
})
export class ComponentModule {}
