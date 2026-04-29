/**
 * Base Repository Interface (Port)
 *
 * Defines the contract that all domain repositories must follow.
 * Infrastructure adapters (Prisma, in-memory, etc.) implement this interface.
 *
 * Design Decision: We use a generic base interface but expect concrete
 * repository interfaces to extend it with domain-specific methods.
 * The base provides only the most universal operations.
 *
 * Why `T` and not a specific entity?
 * → Allows type-safe reuse across all modules (Job, Auth, User).
 * → Concrete interfaces add domain-specific methods (e.g., findByEmail).
 */
export interface IRepository<T> {
  /**
   * Find a single entity by its unique identifier.
   * Returns null if not found (does NOT throw).
   */
  findById(id: string): Promise<T | null>;

  /**
   * Persist an entity (create or update).
   * If the entity has an ID and exists, it's updated.
   * If the entity is new, it's created.
   */
  save(entity: T): Promise<T>;

  /**
   * Remove an entity by its identifier.
   * Implementations may choose soft-delete or hard-delete.
   */
  delete(id: string): Promise<void>;
}

/**
 * Paginated result wrapper.
 * Standardizes pagination across all list operations.
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
