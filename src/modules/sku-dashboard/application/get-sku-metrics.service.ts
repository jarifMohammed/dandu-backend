import AppError from '../../../common/errors/app.error';
import { SkuMetricsDomainModel } from '../domain/models/product.domain';
import { IGetSkuMetricsUseCase } from '../ports/inbound/get-sku-metrics.usecase';
import { ISkuRepository } from '../ports/outbound/sku-repository.port';

export class GetSkuMetricsService implements IGetSkuMetricsUseCase {
  constructor(private readonly skuRepository: ISkuRepository) {}

  async execute(sku: string): Promise<SkuMetricsDomainModel> {
    const normalizedSku = sku.trim();
    if (!normalizedSku) {
      throw AppError.badRequest('SKU is required');
    }

    const metrics = await this.skuRepository.findMetricsBySku(normalizedSku);

    if (!metrics) {
      throw AppError.notFound(`SKU not found: ${normalizedSku}`);
    }

    return metrics;
  }
}
