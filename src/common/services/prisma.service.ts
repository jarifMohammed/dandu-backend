import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomLoggerService } from './custom-logger.service';

/**
 * PrismaService — MongoDB-compatible Prisma Client wrapper.
 *
 * Prisma 7 Breaking Change:
 * - `url` is removed from the schema's datasource block.
 * - For CLI tools (generate, db push): URL is read from prisma.config.ts
 * - For runtime: URL is passed via `datasourceUrl` in the PrismaClient constructor.
 *
 * MongoDB-specific notes:
 * - No driver adapter needed (unlike PostgreSQL's @prisma/adapter-pg).
 * - Connection pooling is managed via MongoDB connection string params.
 * - Transactions require a MongoDB Replica Set (Atlas provides this by default).
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly customLogger: CustomLoggerService) {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'warn', 'error']
          : ['warn', 'error'],
    });
  }

  async onModuleInit() {
    this.customLogger.log('Connecting to MongoDB...', 'PrismaService');
    await this.$connect();
    this.customLogger.log('MongoDB connected successfully', 'PrismaService');
  }

  async onModuleDestroy() {
    this.customLogger.log('Disconnecting from MongoDB...', 'PrismaService');
    await this.$disconnect();
    this.customLogger.log('MongoDB disconnected', 'PrismaService');
  }
}
