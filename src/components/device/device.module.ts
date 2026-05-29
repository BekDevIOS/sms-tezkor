import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import DeviceSchema from '../../schemas/Device.model';
import MemberSchema from '../../schemas/Member.model';
import { MODEL } from '../../libs/types/model-names';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { DispatchModule } from '../../dispatch/dispatch.module';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL.DEVICE, schema: DeviceSchema },
      { name: MODEL.MEMBER, schema: MemberSchema },
    ]),
    AuthModule,
    SubscriptionModule,
    DispatchModule,
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
