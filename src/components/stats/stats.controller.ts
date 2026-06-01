import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MemberStats, StatsRangeQuery } from '../../libs/dto/stats/stats';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(MemberAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('me')
  getMine(@AuthMember('_id') memberId: string, @Query() query: StatsRangeQuery): Promise<MemberStats> {
    return this.statsService.getMemberStats(memberId, query.days);
  }
}
