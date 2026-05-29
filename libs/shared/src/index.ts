// Public surface of the shared library, consumed by apps/api and apps/batch.

// Infrastructure
export { DatabaseModule } from './database/database.module';
export { HttpExceptionFilter } from './common/global-error.filter';
export { AppException } from './common/app.exception';
export { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';

// Dispatch engine (shared by API + batch)
export { DispatchModule } from './dispatch/dispatch.module';
export {
  DispatchService,
  MAX_ATTEMPTS,
  STUCK_PROCESSING_MS,
} from './dispatch/dispatch.service';

// Tokens / enums needed by the batch scheduler
export { MODEL } from './libs/types/model-names';
export { CampaignStatus } from './libs/enums/campaign.enum';
export { Message } from './libs/enums/common';

// Schemas (for forFeature registration in apps)
export { default as CampaignSchema } from './schemas/Campaign.model';
