import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Message } from '@app/shared/libs/enums/common';
import { AuthenticatedRequest } from '@app/shared/libs/types/authenticated-request';
import { SubscriptionService } from './subscription.service';

/**
 * Blocks the route unless the authenticated member has an active subscription.
 * Must run AFTER MemberAuthGuard (which attaches req.member).
 */
@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const memberId = req.member?._id;
    if (!memberId) throw new UnauthorizedException(Message.NOT_AUTHENTICATED);

    const active = await this.subscriptionService.isActive(memberId);
    if (!active) {
      throw new ForbiddenException(Message.SUBSCRIPTION_REQUIRED);
    }
    return true;
  }
}
