export class SkuMetricsResponseDto {
  sku: string;
  product: Record<string, unknown>;
  stock: Record<string, unknown>[];
  channels: Record<string, unknown>[];
  salesMetrics: Record<string, unknown>[];
}
