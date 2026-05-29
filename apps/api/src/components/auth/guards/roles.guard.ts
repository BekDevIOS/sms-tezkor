import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Message } from '@app/shared/libs/enums/common';
import { MemberRole } from '@app/shared/libs/enums/member.enum';
import { AuthenticatedRequest } from '@app/shared/libs/types/authenticated-request';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Allows the route only if the authenticated member's role is in the @Roles list.
 * Must run AFTER MemberAuthGuard (which attaches req.member).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<MemberRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const role = req.member?.memberRole as MemberRole | undefined;
    if (!role || !roles.includes(role)) {
      throw new ForbiddenException(Message.NOT_ALLOWED_REQUEST);
    }
    return true;
  }
}
