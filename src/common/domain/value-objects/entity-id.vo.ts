/**
 * EntityId Value Object
 *
 * Encapsulates the concept of an entity identifier. In our MongoDB setup,
 * IDs are 24-character hex strings (ObjectId format).
 *
 * Why a Value Object?
 * → Provides compile-time type safety: you can't accidentally pass a
 *   random string where an EntityId is expected.
 * → Centralizes validation: ObjectId format is validated in one place.
 * → Makes refactoring easier: if ID format changes, only this class needs updates.
 *
 * Edge Case: MongoDB ObjectIds are exactly 24 hex characters. UUIDs from
 * PostgreSQL (36 chars with hyphens) will NOT pass validation.
 */
export class EntityId {
  private static readonly OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

  private constructor(private readonly _value: string) {}

  /**
   * Creates an EntityId from a string value.
   * Validates that the string is a valid MongoDB ObjectId.
   *
   * @throws Error if the value is not a valid ObjectId
   */
  static create(value: string): EntityId {
    if (!value || !EntityId.OBJECT_ID_REGEX.test(value)) {
      throw new Error(
        `Invalid entity ID format: "${value}". Expected a 24-character hex string (MongoDB ObjectId).`,
      );
    }
    return new EntityId(value);
  }

  /**
   * Creates an EntityId without validation.
   * Use only when the value is guaranteed to be valid (e.g., from database).
   */
  static fromTrusted(value: string): EntityId {
    return new EntityId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: EntityId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
