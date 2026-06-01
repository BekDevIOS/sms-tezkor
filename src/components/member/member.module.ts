import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import SessionSchema from '../../schemas/Session.model';
import DeviceSchema from '../../schemas/Device.model';
import { MODEL } from '../../libs/types/model-names';
import { AuthModule } from '../auth/auth.module';
import { AdminMemberController } from './admin.controller';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL.MEMBER, schema: MemberSchema },
      { name: MODEL.SESSION, schema: SessionSchema },
      { name: MODEL.DEVICE, schema: DeviceSchema },
    ]),
    AuthModule,
  ],
  controllers: [MemberController, AdminMemberController],
  providers: [MemberService],
})
export class MemberModule {}
