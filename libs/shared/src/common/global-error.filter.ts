import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Message } from '../libs/enums/common';
import { HttpErrorBody } from '../libs/types/common';
import { AppException } from './app.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const method = req.method ?? 'UNKNOWN';
    const path = req.url ?? '';
    const timestamp = new Date().toISOString();

    let statusCode: number;
    let errorCode: string;
    let message: string;

    if (exception instanceof AppException) {
      statusCode = exception.statusCode;
      errorCode = exception.errorCode;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body = exception.getResponse();
      message =
        typeof body === 'string'
          ? body
          : ((body as Record<string, unknown>)?.message as string) ??
            exception.message;
      errorCode = message;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = Message.SOMETHING_WENT_WRONG;
      message = Message.SOMETHING_WENT_WRONG;
    }

    const payload: HttpErrorBody = {
      success: false,
      statusCode,
      errorCode,
      message,
      path,
      timestamp,
    };

    const summary = `${method} ${path} → ${statusCode} | ${message}`;
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const err = exception instanceof Error ? exception : undefined;
      this.logger.error(summary, err?.stack);
    } else {
      this.logger.warn(summary);
    }

    res.status(statusCode).json(payload);
  }
}
