import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Member } from '@app/shared/libs/dto/member/member';
import { UpdateMemberDto } from '@app/shared/libs/dto/member/member.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { MemberService } from './member.service';

@Controller('member')
@UseGuards(MemberAuthGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('me')
  getMe(@AuthMember('_id') memberId: string): Promise<Member> {
    return this.memberService.getMe(memberId);
  }

  @Post('me')
  updateMe(@AuthMember('_id') memberId: string, @Body() input: UpdateMemberDto): Promise<Member> {
    return this.memberService.updateMe(memberId, input);
  }
}
