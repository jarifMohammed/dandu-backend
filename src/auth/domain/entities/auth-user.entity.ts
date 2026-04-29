/**
 * AuthUser Domain Entity
 *
 * Represents an authenticated user in the domain layer.
 * Contains business logic for user account management.
 */
export class AuthUserEntity {
  constructor(
    public readonly id: string | null,
    public email: string,
    public password: string,
    public username: string,
    public role: AuthUserRole,
    public verified: boolean,
    public status: AuthUserStatus,
    public tokenVersion: number,
    public deletedAt: Date | null,
    public provider: string,
    public providerId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  get isBlocked(): boolean {
    return this.status === 'BLOCKED' || this.status === 'SUSPENDED';
  }

  get isLocalProvider(): boolean {
    return this.provider === 'local';
  }

  verifyEmail(): void {
    this.verified = true;
  }

  incrementTokenVersion(): void {
    this.tokenVersion += 1;
  }
}

// Domain-level type aliases (mirrored from Prisma)
export type AuthUserRole = 'USER' | 'ADMIN' | 'MODERATOR' | 'SUPERADMIN';
export type AuthUserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'DELETED'
  | 'BLOCKED';
