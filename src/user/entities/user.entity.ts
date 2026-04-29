import { ApiProperty } from '@nestjs/swagger';

/**
 * User entity for API responses
 * This is only needed for Swagger documentation
 */
export class User {
  @ApiProperty({ example: 1, description: 'User unique identifier' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({ example: true, description: 'Email verification status' })
  isVerified: boolean;

  @ApiProperty({
    example: '2026-02-03T10:00:00.000Z',
    description: 'Account creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-02-03T10:00:00.000Z',
    description: 'Last update date',
  })
  updatedAt: Date;
}
