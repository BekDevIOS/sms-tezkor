import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { MODEL } from '../../libs/types/model-names';
import { AuthModule } from '../auth/auth.module';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: MODEL.MEMBER, schema: MemberSchema }]), AuthModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
