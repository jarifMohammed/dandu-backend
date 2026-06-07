import { SkuMetricsDomainModel } from '../../domain/models/product.domain';

export interface IGetSkuMetricsUseCase {
  execute(sku: string): Promise<SkuMetricsDomainModel>;
}
