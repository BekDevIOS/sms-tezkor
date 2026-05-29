import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CampaignScheduler } from './components/campaign/campaign.scheduler';
import { DatabaseModule } from './database/database.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { MODEL } from './libs/types/model-names';
import CampaignSchema from './schemas/Campaign.model';

/**
 * Worker process root module. Runs the cron scheduler only — no HTTP.
 * Deploy as a single instance alongside (any number of) API instances.
 */
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
export class SchedulerModule {}
