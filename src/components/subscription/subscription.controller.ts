import { Controller, Get, UseGuards } from '@nestjs/common';
import { Subscription } from '../../libs/dto/subscription/subscription';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
@UseGuards(MemberAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /** The logged-in member views their own subscription status. */
  @Get('me')
  getMine(@AuthMember('_id') memberId: string): Promise<Subscription | null> {
    return this.subscriptionService.getMine(memberId);
  }
}
