import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppException } from '../../common/app.exception';
import { Member } from '../../libs/dto/member/member';
import { UpdateMemberDto } from '../../libs/dto/member/member.input';
import { Message } from '../../libs/enums/common';
import { MODEL } from '../../libs/types/model-names';

@Injectable()
export class MemberService {
  constructor(@InjectModel(MODEL.MEMBER) private readonly memberModel: Model<any>) {}

  async getMe(memberId: string): Promise<Member> {
    const member = await this.memberModel.findById(memberId).lean();
    if (!member) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.MEMBER_NOT_FOUND);
    }
    return member as Member;
  }

  async updateMe(memberId: string, input: UpdateMemberDto): Promise<Member> {
    const member = await this.memberModel.findByIdAndUpdate(memberId, { $set: input }, { new: true }).lean();
    if (!member) {
      throw new AppException(HttpStatus.NOT_FOUND, Message.MEMBER_NOT_FOUND);
    }
    return member as Member;
  }
}
