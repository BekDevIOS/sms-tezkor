import type { Request } from 'express';

/**
 * Minimal shapes attached to the request by the auth guards.
 * `member` is set by MemberAuthGuard, `device` by DeviceAuthGuard.
 */
export interface AuthenticatedMember {
  _id: string;
  memberEmail: string;
  memberRole: string;
  memberStatus: string;
}

export interface AuthenticatedDevice {
  _id: string;
  memberId: string;
  code: string;
  sendLimitPerMinute: number;
}

export interface AuthSession {
  _id: string;
  token: string;
  type: string;
}

export interface AuthenticatedRequest extends Request {
  member?: AuthenticatedMember;
  device?: AuthenticatedDevice;
  session?: AuthSession;
}
