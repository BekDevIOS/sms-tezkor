import type { Types } from 'mongoose';

export interface DeviceSession {
	userId: Types.ObjectId;
	deviceId: Types.ObjectId;
	sessionAccessToken: string;
	sessionRefreshToken: string;
	sessionIpAddress: string;
	sessionUserAgent: string;
	sessionIsActive: boolean;
	sessionLastSeenAt?: Date;
	sessionExpiresAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
