import AppError from '../../../common/errors/app.error';
import {
  ImportReportCommand,
  ImportReportResult,
  IImportReportUseCase,
} from '../ports/inbound/import-report.usecase';
import { CsvParserService } from './csv-parser.service';

export class ImportReportService implements IImportReportUseCase {
  constructor(private readonly csvParser: CsvParserService) {}

  async execute(command: ImportReportCommand): Promise<ImportReportResult> {
    const rows = this.csvParser.parse(command.content);

    if (rows.length === 0) {
      throw AppError.badRequest('CSV report is empty');
    }

    return {
      batchId: 'pending-persistence',
      totalRows: rows.length,
      importedRows: 0,
      failedRows: rows.length,
    };
  }
}
