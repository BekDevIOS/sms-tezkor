import {
	CallHandler,
	ExecutionContext,
	Injectable,
	Logger,
	NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Never log these — secrets and PII / bulky payloads. Used in development only;
// in production we do not log request/response bodies at all.
const SENSITIVE_BODY_KEYS = new Set([
	'password',
	'userPassword',
	'token',
	'refreshToken',
	'accessToken',
	'sessionAccessToken',
	'sessionRefreshToken',
	'memberImage', // base64 avatar — floods logs
	'message', // SMS content
	'body', // auto-reply / SMS content
	'replyBody',
]);

const IS_PROD = process.env.NODE_ENV === 'production';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(LoggingInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		if (context.getType() !== 'http') {
			return next.handle();
		}

		const req = context.switchToHttp().getRequest<Request>();
		const res = context.switchToHttp().getResponse<Response>();
		const started = Date.now();
		const { method, originalUrl } = req;

		// In production: log only the request line (method/url) — no bodies, so
		// SMS content, phone numbers and base64 images never reach the logs.
		if (!IS_PROD) {
			this.logger.log(`${method} ${originalUrl} ${this.previewBody(req.body)}`, 'REQUEST');
		}

		return next.handle().pipe(
			tap({
				next: (data: unknown) => {
					const ms = Date.now() - started;
					const detail = IS_PROD ? '' : ` ${this.stringify(data)}`;
					this.logger.log(`${method} ${originalUrl} ${res.statusCode} ${ms}ms${detail}`, 'RESPONSE');
				},
				error: (err: unknown) => {
					const ms = Date.now() - started;
					const message =
						err instanceof Error ? err.message : String(err);
					this.logger.warn(
						`${method} ${originalUrl} ${res.statusCode} ${ms}ms ${message}`,
						'ERROR',
					);
				},
			}),
		);
	}

	private previewBody(body: unknown): string {
		if (body == null || typeof body !== 'object') {
			return '';
		}
		const redacted: Record<string, unknown> = {
			...(body as Record<string, unknown>),
		};
		for (const key of SENSITIVE_BODY_KEYS) {
			if (key in redacted) {
				redacted[key] = '[REDACTED]';
			}
		}
		const s = this.stringify(redacted, 400);
		return s ? `body=${s}` : '';
	}

	private stringify(value: unknown, maxLen = 500): string {
		try {
			const s = JSON.stringify(value);
			if (s === undefined) {
				return '';
			}
			return s.length > maxLen ? `${s.slice(0, maxLen)}…` : s;
		} catch {
			return '[unserializable]';
		}
	}
}
