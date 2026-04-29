import { DomainException } from '../domain/exceptions/domain.exception';

/**
 * Custom Application Error class
 * Extends the framework-agnostic domain exception base and is mapped to HTTP
 * by the global exception filter.
 */
class AppError extends DomainException {
  public readonly errors?: unknown;

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message, statusCode, 'APPLICATION_ERROR');
    this.errors = errors;
  }

  static badRequest(
    message: string,
    errors?: unknown,
    code?: string,
  ): AppError {
    return new AppError(400, message, { errors, code });
  }

  static unauthorized(message: string = 'Unauthorized'): AppError {
    return new AppError(401, message);
  }

  static forbidden(message: string = 'Forbidden'): AppError {
    return new AppError(403, message);
  }

  static notFound(message: string = 'Not Found'): AppError {
    return new AppError(404, message);
  }

  static conflict(message: string, errors?: unknown): AppError {
    return new AppError(409, message, errors);
  }

  static internalServerError(
    message: string = 'Internal Server Error',
  ): AppError {
    return new AppError(500, message);
  }

  static tooManyRequests(message: string = 'Too Many Requests'): AppError {
    return new AppError(429, message);
  }

  static serviceUnavailable(message: string = 'Service Unavailable'): AppError {
    return new AppError(503, message);
  }
}

export default AppError;
