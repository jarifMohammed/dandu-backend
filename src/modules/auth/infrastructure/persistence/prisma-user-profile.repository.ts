import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/services/prisma.service';
import { PrismaTransactionContext } from '../../../../common/infrastructure/persistence/prisma-unit-of-work';
import { ITransactionContext } from '../../../../common/domain/interfaces/unit-of-work.interface';
import {
  CreateUserProfileData,
  IUserProfileRepository,
} from '../../domain/repositories/user-profile.repository.interface';

@Injectable()
export class PrismaUserProfileRepository implements IUserProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateUserProfileData,
    ctx?: ITransactionContext,
  ): Promise<void> {
    const cl = ctx ? (ctx as PrismaTransactionContext).prisma : this.prisma;
    await cl.userProfile.create({
      data: {
        authId: data.authId,
        firstName: data.firstName,
        lastName: data.lastName,
        avatarUrl: data.avatarUrl ?? null,
      },
    });
  }
}
