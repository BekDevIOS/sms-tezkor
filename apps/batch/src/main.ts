import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BatchModule } from './batch.module';

async function bootstrap() {
  // No HTTP server — this is a headless worker that runs the cron scheduler.
  const app = await NestFactory.createApplicationContext(BatchModule);
  app.enableShutdownHooks();
  Logger.log('Batch worker started (cron scheduler running)', 'Batch');
}
bootstrap();
