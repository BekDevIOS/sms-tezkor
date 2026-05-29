import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '@app/shared/libs/types/authenticated-request';

/**
 * Injects the authenticated member (set by MemberAuthGuard).
 * Pass a field name to extract a single property, e.g. `@AuthMember('_id')`.
 */
export const AuthMember = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  const member = req.member;
  if (!member) return null;
  return data ? (member as unknown as Record<string, unknown>)[data] : member;
});
