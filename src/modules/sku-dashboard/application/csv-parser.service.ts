export interface ParsedCsvRow {
  rowNumber: number;
  values: Record<string, string>;
}

export class CsvParserService {
  parse(content: Buffer): ParsedCsvRow[] {
    const text = content.toString('utf8').trim();
    if (!text) return [];

    const [headerLine, ...lines] = text.split(/\r?\n/);
    const headers = this.parseLine(headerLine);

    return lines.map((line, index) => {
      const values = this.parseLine(line);
      return {
        rowNumber: index + 2,
        values: Object.fromEntries(
          headers.map((header, headerIndex) => [
            header,
            values[headerIndex] ?? '',
          ]),
        ),
      };
    });
  }

  private parseLine(line: string): string[] {
    return line.split(',').map((value) => value.trim());
  }
}
