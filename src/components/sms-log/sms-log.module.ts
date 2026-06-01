import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL } from '../../libs/types/model-names';
import SmsLogSchema from '../../schemas/Sms-log.model';
import { AuthModule } from '../auth/auth.module';
import { AdminSmsLogController } from './admin.controller';
import { SmsLogController } from './sms-log.controller';
import { SmsLogService } from './sms-log.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MODEL.SMS_LOG, schema: SmsLogSchema }]),
    AuthModule,
  ],
  controllers: [SmsLogController, AdminSmsLogController],
  providers: [SmsLogService],
})
export class SmsLogModule {}
