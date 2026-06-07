import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../common/services/prisma.service';
import { ISkuRepository } from '../../../ports/outbound/sku-repository.port';
import { SkuMetricsDomainModel } from '../../../domain/models/product.domain';
import { SkuDashboardMapper } from './mappers/sku-dashboard.mapper';

@Injectable()
export class PrismaSkuDashboardRepository implements ISkuRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMetricsBySku(sku: string): Promise<SkuMetricsDomainModel | null> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
      include: {
        stock: {
          orderBy: [{ country: 'asc' }, { locationType: 'asc' }],
        },
        channels: {
          orderBy: [{ channel: 'asc' }, { country: 'asc' }],
        },
        salesMetrics: {
          orderBy: [{ periodEnd: 'desc' }, { channel: 'asc' }],
        },
      },
    });

    return product ? SkuDashboardMapper.toDomain(product) : null;
  }
}
