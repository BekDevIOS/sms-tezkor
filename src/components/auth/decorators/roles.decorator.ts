import { SetMetadata } from '@nestjs/common';
import { MemberRole } from '../../../libs/enums/member.enum';

export const ROLES_KEY = 'roles';

/** Restrict a route/controller to the given member roles (used with RolesGuard). */
export const Roles = (...roles: MemberRole[]) => SetMetadata(ROLES_KEY, roles);
