import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  Subscription,
  Subscriptions,
} from '../../libs/dto/subscription/subscription';
import {
  ActivateSubscriptionDto,
  SubscriptionsInquiry,
} from '../../libs/dto/subscription/subscription.input';
import { MemberRole } from '../../libs/enums/member.enum';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberAuthGuard } from '../auth/guards/member-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SubscriptionService } from './subscription.service';

@Controller('admin/subscription')
@UseGuards(MemberAuthGuard, RolesGuard)
@Roles(MemberRole.ADMIN, MemberRole.OWNER)
export class AdminSubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /** Activate (or renew) a member's subscription. */
  @Post('member/:memberId')
  activate(
    @Param('memberId') memberId: string,
    @Body() input: ActivateSubscriptionDto,
    @AuthMember('_id') adminId: string,
  ): Promise<Subscription> {
    return this.subscriptionService.activate(memberId, input, adminId);
  }

  @Post(':id/cancel')
  @HttpCode(200)
  cancel(@Param('id') id: string): Promise<Subscription> {
    return this.subscriptionService.cancel(id);
  }

  @Get()
  list(@Query() inquiry: SubscriptionsInquiry): Promise<Subscriptions> {
    return this.subscriptionService.list(inquiry);
  }
}
