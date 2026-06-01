import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SmsLogs, SmsLogsInquiry } from '../../libs/dto/sms-log/sms-log.query';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { SmsLogService } from './sms-log.service';

@Controller('sms-log')
@UseGuards(MemberAuthGuard)
export class SmsLogController {
  constructor(private readonly smsLogService: SmsLogService) {}

  @Get()
  getMine(@AuthMember('_id') memberId: string, @Query() inquiry: SmsLogsInquiry): Promise<SmsLogs> {
    return this.smsLogService.getMine(memberId, inquiry);
  }
}
