import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL } from '../../libs/types/model-names';
import AutoReplySchema from '../../schemas/Auto-reply.model';
import DeviceSchema from '../../schemas/Device.model';
import { AuthModule } from '../auth/auth.module';
import { AutoReplyController } from './auto-reply.controller';
import { AutoReplyService } from './auto-reply.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL.AUTO_REPLY, schema: AutoReplySchema },
      { name: MODEL.DEVICE, schema: DeviceSchema },
    ]),
    AuthModule,
  ],
  controllers: [AutoReplyController],
  providers: [AutoReplyService],
})
export class AutoReplyModule {}
