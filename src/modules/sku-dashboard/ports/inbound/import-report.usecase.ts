export interface ImportReportCommand {
  fileName: string;
  content: Buffer;
  uploadedBy?: string;
}

export interface ImportReportResult {
  batchId: string;
  totalRows: number;
  importedRows: number;
  failedRows: number;
}

export interface IImportReportUseCase {
  execute(command: ImportReportCommand): Promise<ImportReportResult>;
}
