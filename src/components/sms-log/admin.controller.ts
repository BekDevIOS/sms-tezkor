import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SmsLogs, SmsLogsInquiry } from '../../libs/dto/sms-log/sms-log.query';
import { MemberRole } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SmsLogService } from './sms-log.service';

@Controller('admin/sms-log')
@UseGuards(MemberAuthGuard, RolesGuard)
@Roles(MemberRole.ADMIN, MemberRole.OWNER)
export class AdminSmsLogController {
  constructor(private readonly smsLogService: SmsLogService) {}

  @Get()
  getAll(@Query() inquiry: SmsLogsInquiry): Promise<SmsLogs> {
    return this.smsLogService.getAll(inquiry);
  }
}
