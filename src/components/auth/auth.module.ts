import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import DeviceSchema from '../../schemas/Device.model';
import MemberSchema from '../../schemas/Member.model';
import SessionSchema from '../../schemas/Session.model';
import { MODEL } from '../../libs/types/model-names';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DeviceAuthGuard } from './guards/device-auth.guard';
import { MemberAuthGuard } from './guards/member-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL.MEMBER, schema: MemberSchema },
      { name: MODEL.SESSION, schema: SessionSchema },
      { name: MODEL.DEVICE, schema: DeviceSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, MemberAuthGuard, DeviceAuthGuard, RolesGuard],
  exports: [
    AuthService,
    MemberAuthGuard,
    DeviceAuthGuard,
    RolesGuard,
    MongooseModule,
  ],
})
export class AuthModule {}
