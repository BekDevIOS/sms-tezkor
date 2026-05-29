import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import {
  CampaignSchema,
  DatabaseModule,
  DispatchModule,
  MODEL,
} from '@app/shared';
import { CampaignScheduler } from './campaign.scheduler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    DispatchModule,
    MongooseModule.forFeature([{ name: MODEL.CAMPAIGN, schema: CampaignSchema }]),
  ],
  providers: [CampaignScheduler],
})
export class BatchModule {}
