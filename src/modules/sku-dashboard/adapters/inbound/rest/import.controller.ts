import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../../../common/guards/auth.guard';
import { ImportReportService } from '../../../application/import-report.service';

@ApiTags('SKU Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('sku-dashboard')
export class ImportController {
  constructor(private readonly importReportService: ImportReportService) {}

  @Post('import')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Import historical SKU report CSV' })
  @ApiResponse({ status: 200, description: 'Report import processed' })
  async importReport(
    @Body('fileName') fileName: string,
    @Body('content') content: string,
  ) {
    const result = await this.importReportService.execute({
      fileName,
      content: Buffer.from(content ?? '', 'utf8'),
    });

    return {
      message: 'Report import processed',
      data: result,
    };
  }
}
