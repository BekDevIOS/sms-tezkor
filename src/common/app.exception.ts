export class AppException extends Error {
  readonly statusCode: number;
  readonly errorCode: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'AppException';
    this.statusCode = statusCode;
    this.errorCode = message;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, AppException);
  }
}
