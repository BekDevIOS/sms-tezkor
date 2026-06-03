import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Plan } from '../../libs/dto/plan/plan';
import { UpdatePlanDto } from '../../libs/dto/plan/plan.input';
import { MemberRole } from '../../libs/enums/member.enum';
import { SubscriptionPlan } from '../../libs/enums/subscription.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PlanService } from './plan.service';

@Controller('admin/plan')
@UseGuards(MemberAuthGuard, RolesGuard)
@Roles(MemberRole.ADMIN, MemberRole.OWNER)
export class AdminPlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  list(): Promise<Plan[]> {
    return this.planService.listAll();
  }

  /** Patch one plan's price / limits / duration / visibility. */
  @Post(':code')
  update(
    @Param('code') code: SubscriptionPlan,
    @Body() input: UpdatePlanDto,
  ): Promise<Plan> {
    return this.planService.update(code, input);
  }
}
