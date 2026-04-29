import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import {
  IUnitOfWork,
  ITransactionContext,
} from '../../domain/interfaces/unit-of-work.interface';
import { TransactionFailedException } from '../../domain/exceptions/domain.exception';

/**
 * Prisma Transaction Context
 *
 * Wraps Prisma's TransactionClient in our opaque ITransactionContext interface.
 * This is the only place where the infrastructure-specific type is exposed.
 */
export class PrismaTransactionContext implements ITransactionContext {
  readonly __brand = 'TransactionContext' as const;

  constructor(public readonly prisma: Prisma.TransactionClient) {}
}

/**
 * Prisma Unit of Work (Adapter)
 *
 * Implements the IUnitOfWork port using Prisma's interactive transactions.
 *
 * MongoDB Edge Cases:
 * - Transactions require a MongoDB replica set (Atlas has this by default).
 * - Transaction timeout is set to 10s (MongoDB default is 60s but we fail fast).
 * - maxWait is 5s — how long to wait for a connection from the pool.
 *
 * Usage in services:
 * ```typescript
 * constructor(@Inject(UNIT_OF_WORK_TOKEN) private readonly uow: IUnitOfWork) {}
 *
 * async createJob(data: CreateJobDto) {
 *   return this.uow.execute(async (ctx) => {
 *     const job = await this.jobRepo.save(jobEntity, ctx);
 *     await this.timelineRepo.save(event, ctx);
 *     return job;
 *   });
 * }
 * ```
 */
@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  async execute<T>(work: (ctx: ITransactionContext) => Promise<T>): Promise<T> {
    try {
      return await this.prisma.$transaction(
        async (tx) => {
          const context = new PrismaTransactionContext(tx);
          return await work(context);
        },
        {
          maxWait: 5000, // Max time to wait for connection from pool
          timeout: 10000, // Max transaction duration
        },
      );
    } catch (error) {
      // If it's already a domain exception, rethrow as-is
      if (error instanceof TransactionFailedException) {
        throw error;
      }

      // Wrap Prisma-specific errors
      const message =
        error instanceof Error ? error.message : 'Unknown transaction error';
      throw new TransactionFailedException('database transaction', message);
    }
  }
}
