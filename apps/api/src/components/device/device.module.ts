import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import DeviceSchema from '@app/shared/schemas/Device.model';
import MemberSchema from '@app/shared/schemas/Member.model';
import { MODEL } from '@app/shared/libs/types/model-names';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { DispatchModule } from '@app/shared/dispatch/dispatch.module';
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
