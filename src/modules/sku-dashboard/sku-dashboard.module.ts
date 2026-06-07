import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SkuDashboardController } from './adapters/inbound/rest/sku-dashboard.controller';
import { ImportController } from './adapters/inbound/rest/import.controller';
import { CsvParserService } from './application/csv-parser.service';
import { GetSkuMetricsService } from './application/get-sku-metrics.service';
import { ImportReportService } from './application/import-report.service';
import {
  SKU_REPOSITORY_TOKEN,
  ISkuRepository,
} from './ports/outbound/sku-repository.port';
import { PrismaSkuDashboardRepository } from './adapters/outbound/persistence/prisma-sku-dashboard.repository';

@Module({
  imports: [AuthModule],
  controllers: [SkuDashboardController, ImportController],
  providers: [
    CsvParserService,
    PrismaSkuDashboardRepository,
    {
      provide: SKU_REPOSITORY_TOKEN,
      useExisting: PrismaSkuDashboardRepository,
    },
    {
      provide: GetSkuMetricsService,
      useFactory: (skuRepository: ISkuRepository) =>
        new GetSkuMetricsService(skuRepository),
      inject: [SKU_REPOSITORY_TOKEN],
    },
    {
      provide: ImportReportService,
      useFactory: (csvParserService: CsvParserService) =>
        new ImportReportService(csvParserService),
      inject: [CsvParserService],
    },
  ],
})
export class SkuDashboardModule {}
