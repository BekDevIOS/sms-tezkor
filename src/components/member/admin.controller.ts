import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Member, Members } from '../../libs/dto/member/member';
import { AdminUpdateMemberDto, MembersInquiry } from '../../libs/dto/member/member.input';
import { MemberRole } from '../../libs/enums/member.enum';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberService } from './member.service';

@Controller('admin/member')
@UseGuards(MemberAuthGuard, RolesGuard)
@Roles(MemberRole.ADMIN, MemberRole.OWNER)
export class AdminMemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  list(@Query() inquiry: MembersInquiry): Promise<Members> {
    return this.memberService.listMembers(inquiry);
  }

  @Get('/:id')
  detail(@Param('id') id: string): Promise<Member> {
    return this.memberService.getMemberDetail(id);
  }

  /** Block/unblock (memberStatus) or change role. */
  @Post('/:id')
  update(
    @AuthMember() actor: Member,
    @Param('id') id: string,
    @Body() input: AdminUpdateMemberDto,
  ): Promise<Member> {
    return this.memberService.adminUpdate(actor, id, input);
  }

  @Post('/:id/delete')
  @HttpCode(200)
  remove(@AuthMember() actor: Member, @Param('id') id: string) {
    return this.memberService.softDelete(actor, id);
  }
}
