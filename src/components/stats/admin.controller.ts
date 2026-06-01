import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminStats, StatsRangeQuery } from '../../libs/dto/stats/stats';
import { MemberRole } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { StatsService } from './stats.service';

@Controller('admin/stats')
@UseGuards(MemberAuthGuard, RolesGuard)
@Roles(MemberRole.ADMIN, MemberRole.OWNER)
export class AdminStatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getAll(@Query() query: StatsRangeQuery): Promise<AdminStats> {
    return this.statsService.getAdminStats(query.days);
  }
}
