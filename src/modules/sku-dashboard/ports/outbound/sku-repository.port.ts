import { SkuMetricsDomainModel } from '../../domain/models/product.domain';

export interface ISkuRepository {
  findMetricsBySku(sku: string): Promise<SkuMetricsDomainModel | null>;
}

export const SKU_REPOSITORY_TOKEN = Symbol('ISkuRepository');
