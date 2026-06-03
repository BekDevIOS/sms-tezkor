import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AutoReplyModule } from './auto-reply/auto-reply.module';
import { CampaignModule } from './campaign/campaign.module';
import { ContactModule } from './contact/contact.module';
import { ContactGroupModule } from './contact-group/contact-group.module';
import { DeviceModule } from './device/device.module';
import { MemberModule } from './member/member.module';
import { PlanModule } from './plan/plan.module';
import { SmsLogModule } from './sms-log/sms-log.module';
import { StatsModule } from './stats/stats.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TemplateModule } from './template/template.module';

@Module({
  imports: [
    AuthModule,
    MemberModule,
    PlanModule,
    ContactModule,
    ContactGroupModule,
    CampaignModule,
    DeviceModule,
    SubscriptionModule,
    SmsLogModule,
    StatsModule,
    TemplateModule,
    AutoReplyModule,
  ],
})
export class ComponentModule {}
