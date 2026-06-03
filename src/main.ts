import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/global-error.filter';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';

const isProd = process.env.NODE_ENV === 'production';

/**
 * Builds the CORS origin checker from CORS_ORIGINS (comma-separated allowlist).
 * Production REQUIRES an explicit allowlist. In development, if the list is
 * empty we allow localhost/127.0.0.1 on any port for convenience.
 */
function buildCorsOrigin(): (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => void {
  const allowlist = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  return (origin, cb) => {
    // Non-browser clients (curl, mobile app, server-to-server) send no Origin.
    if (!origin) return cb(null, true);
    if (allowlist.includes(origin)) return cb(null, true);
    if (!isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return cb(null, true);
    }
    return cb(new Error(`Origin not allowed by CORS: ${origin}`), false);
  };
}

/** Fail fast if a required production env var is missing. */
function assertProdEnv(): void {
  if (!isProd) return;
  const missing: string[] = [];
  if (!process.env.MONGO_PROD) missing.push('MONGO_PROD');
  if (!process.env.CORS_ORIGINS) missing.push('CORS_ORIGINS');
  if (missing.length) {
    throw new Error(`Missing required production env vars: ${missing.join(', ')}`);
  }
}

async function bootstrap() {
  assertProdEnv();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // In production our own LoggingInterceptor + Logger handle output; mute
    // verbose framework debug logs.
    logger: isProd ? ['error', 'warn', 'log'] : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security headers (HSTS, X-Content-Type-Options, frameguard, etc.).
  app.use(helmet());

  // Behind nginx/Caddy: trust the proxy so secure cookies / client IPs work.
  app.set('trust proxy', 1);

  // Allow base64 profile images (data URLs) in JSON bodies; the Express default
  // is ~100kb which is too small for an inline avatar.
  app.useBodyParser('json', { limit: '5mb' });
  app.useBodyParser('urlencoded', { limit: '5mb', extended: true });

  // Enable nested query objects, e.g. ?search[text]=foo&search[status]=ACTIVE
  app.getHttpAdapter().getInstance().set('query parser', 'extended');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Strict CORS allowlist (no origin reflection).
  app.enableCors({ origin: buildCorsOrigin(), credentials: true });

  // Clean shutdown so in-flight work finishes and Mongo connections close.
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 4009;
  await app.listen(port);
  Logger.log(`API server running on port ${port} (${isProd ? 'production' : 'development'})`, 'Bootstrap');
}
bootstrap();
