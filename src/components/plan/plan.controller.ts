import { Controller, Get, UseGuards } from '@nestjs/common';
import { Plan } from '../../libs/dto/plan/plan';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { PlanService } from './plan.service';

@Controller('plan')
@UseGuards(MemberAuthGuard)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  /** Active plans shown to members on the subscription page. */
  @Get()
  list(): Promise<Plan[]> {
    return this.planService.listActive();
  }
}
