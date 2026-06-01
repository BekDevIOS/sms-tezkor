import { Schema } from 'mongoose';
import { AutoReplyMatchType, AutoReplyStatus } from '../libs/enums/auto-reply.enum';

const AutoReplySchema = new Schema(
	{
		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
			index: true,
		},
		triggerText: {
			type: String,
			required: true,
			trim: true,
		},
		replyBody: {
			type: String,
			required: true,
		},
		matchType: {
			type: String,
			enum: AutoReplyMatchType,
			default: AutoReplyMatchType.CONTAINS,
		},
		enabled: {
			type: Boolean,
			default: true,
		},
		// Optional: scope the rule to a single device. Null = all of the member's devices.
		deviceId: {
			type: Schema.Types.ObjectId,
			ref: 'Device',
		},
		status: {
			type: String,
			enum: AutoReplyStatus,
			default: AutoReplyStatus.ACTIVE,
			index: true,
		},
	},
	{ timestamps: true, collection: 'auto_replies' },
);

AutoReplySchema.index({ memberId: 1, enabled: 1 });

export default AutoReplySchema;

/**
 * EXECUTION IS NOT YET IMPLEMENTED (documented future phase).
 * To make auto-replies actually fire:
 *   1. Inbound channel: `POST /device/inbound` (DeviceAuthGuard) where the
 *      Android app reports a received SMS `{ fromPhone, body, receivedAt }`.
 *   2. Persist inbound messages in a new `InboundSms` collection.
 *   3. Matching service: load the member's enabled+ACTIVE rules (optionally
 *      device-scoped), evaluate matchType (EXACT/CONTAINS/PREFIX) against body
 *      using escaped string comparison (never raw RegExp), pick the first match.
 *   4. Enqueue the reply through the existing DispatchService (e.g. a tiny
 *      one-recipient campaign) rather than a parallel sender.
 *   5. Loop-guard: rate-limit replies per fromPhone to avoid auto-reply loops.
 */
