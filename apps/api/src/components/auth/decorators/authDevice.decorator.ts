import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '@app/shared/libs/types/authenticated-request';

/**
 * Injects the authenticated device (set by DeviceAuthGuard).
 * Pass a field name to extract a single property, e.g. `@AuthDevice('_id')`.
 */
export const AuthDevice = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  const device = req.device;
  if (!device) return null;
  return data ? (device as unknown as Record<string, unknown>)[data] : device;
});
