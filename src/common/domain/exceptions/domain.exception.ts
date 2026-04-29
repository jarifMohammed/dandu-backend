/**
 * Base Domain Exception
 *
 * All domain-level exceptions extend this class. These are infrastructure-agnostic
 * and represent business rule violations or domain invariant breaches.
 *
 * Why not use NestJS HttpException directly?
 * → The domain layer must not know about HTTP. These exceptions are caught by
 *   the infrastructure layer (controllers/filters) and mapped to HTTP responses.
 */
export class DomainException extends Error {
  public readonly httpStatus: number;
  public readonly code: string;

  constructor(
    message: string,
    httpStatus: number = 500,
    code: string = 'DOMAIN_ERROR',
  ) {
    super(message);
    this.name = this.constructor.name;
    this.httpStatus = httpStatus;
    this.code = code;
    // Maintains proper stack trace for where our error was thrown (V8 engines)
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Thrown when an entity is not found by its identifier.
 */
export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, identifier: string) {
    super(
      `${entityName} not found with identifier: ${identifier}`,
      404,
      'ENTITY_NOT_FOUND',
    );
  }
}

/**
 * Thrown when attempting to create a duplicate entity
 * (e.g., unique constraint violation at the domain level).
 */
export class DuplicateEntityException extends DomainException {
  constructor(entityName: string, field: string, value: string) {
    super(
      `${entityName} with ${field} "${value}" already exists`,
      409,
      'DUPLICATE_ENTITY',
    );
  }
}

/**
 * Thrown when a user lacks permission to perform an action on a resource.
 * This is domain-level authorization, not authentication.
 */
export class AuthorizationException extends DomainException {
  constructor(
    message: string = 'You do not have permission to perform this action',
  ) {
    super(message, 403, 'AUTHORIZATION_DENIED');
  }
}

/**
 * Thrown when domain validation rules are violated.
 * Distinct from DTO validation — this is business logic validation
 * (e.g., invalid state transition, invalid date range).
 */
export class DomainValidationException extends DomainException {
  public readonly violations: ValidationViolation[];

  constructor(message: string, violations: ValidationViolation[] = []) {
    super(message, 422, 'VALIDATION_FAILED');
    this.violations = violations;
  }
}

/**
 * Thrown when a transaction fails at the domain/infrastructure boundary.
 */
export class TransactionFailedException extends DomainException {
  constructor(operation: string, reason?: string) {
    super(
      `Transaction failed during ${operation}${reason ? `: ${reason}` : ''}`,
      500,
      'TRANSACTION_FAILED',
    );
  }
}

/**
 * Represents a single field validation violation.
 */
export interface ValidationViolation {
  field: string;
  message: string;
  value?: unknown;
}
