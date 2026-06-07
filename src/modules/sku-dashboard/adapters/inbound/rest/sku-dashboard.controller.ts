import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../../../common/guards/auth.guard';
import { SkuSearchQueryDto } from '../../../dto/sku-search-query.dto';
import { GetSkuMetricsService } from '../../../application/get-sku-metrics.service';

@ApiTags('SKU Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('sku-dashboard')
export class SkuDashboardController {
  constructor(private readonly getSkuMetricsService: GetSkuMetricsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search SKU dashboard metrics' })
  @ApiResponse({
    status: 200,
    description: 'SKU metrics retrieved successfully',
  })
  async search(@Query() query: SkuSearchQueryDto) {
    const result = await this.getSkuMetricsService.execute(query.sku);

    return {
      message: 'SKU metrics retrieved successfully',
      data: result,
    };
  }
}
