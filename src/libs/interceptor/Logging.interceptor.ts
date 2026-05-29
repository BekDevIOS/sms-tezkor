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

const SENSITIVE_BODY_KEYS = new Set([
	'password',
	'userPassword',
	'token',
	'refreshToken',
	'accessToken',
	'sessionAccessToken',
	'sessionRefreshToken',
]);

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

		this.logger.log(
			`${method} ${originalUrl} ${this.previewBody(req.body)}`,
			'REQUEST',
		);

		return next.handle().pipe(
			tap({
				next: (data: unknown) => {
					const ms = Date.now() - started;
					this.logger.log(
						`${method} ${originalUrl} ${res.statusCode} ${ms}ms ${this.stringify(data)}`,
						'RESPONSE',
					);
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
