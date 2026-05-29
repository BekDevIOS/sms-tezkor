import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SchedulerModule } from './scheduler.module';

async function bootstrap() {
  // No HTTP server — headless worker running the cron scheduler.
  const app = await NestFactory.createApplicationContext(SchedulerModule);
  app.enableShutdownHooks();
  Logger.log('Scheduler worker started (cron running)', 'Scheduler');
}
bootstrap();
