import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AutoReplies, AutoReply } from '../../libs/dto/auto-reply/auto-reply';
import {
  AutoRepliesInquiry,
  CreateAutoReplyDto,
  UpdateAutoReplyDto,
} from '../../libs/dto/auto-reply/auto-reply.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { AutoReplyService } from './auto-reply.service';

@Controller('auto-reply')
@UseGuards(MemberAuthGuard)
export class AutoReplyController {
  constructor(private readonly autoReplyService: AutoReplyService) {}

  @Post()
  create(@AuthMember('_id') memberId: string, @Body() input: CreateAutoReplyDto): Promise<AutoReply> {
    return this.autoReplyService.create(memberId, input);
  }

  @Get()
  getList(@AuthMember('_id') memberId: string, @Query() inquiry: AutoRepliesInquiry): Promise<AutoReplies> {
    return this.autoReplyService.getList(memberId, inquiry);
  }

  @Get('/:id')
  getOne(@AuthMember('_id') memberId: string, @Param('id') id: string): Promise<AutoReply> {
    return this.autoReplyService.getOne(memberId, id);
  }

  @Post('/:id')
  update(
    @AuthMember('_id') memberId: string,
    @Param('id') id: string,
    @Body() input: UpdateAutoReplyDto,
  ): Promise<AutoReply> {
    return this.autoReplyService.update(memberId, id, input);
  }

  @Post('/:id/delete')
  @HttpCode(200)
  remove(@AuthMember('_id') memberId: string, @Param('id') id: string) {
    return this.autoReplyService.remove(memberId, id);
  }
}
