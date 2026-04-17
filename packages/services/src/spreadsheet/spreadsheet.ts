import { Buffer } from 'buffer';
import * as ExcelJS from 'exceljs';

import { chunk } from '../array';

import { Table, type TableParams, type TablesParams } from './table';
import { type Cell, ECellType, WorkSheet,  } from './worksheet';

type CalculateTablesParamsNextRowParams = {
    spaceTop?: number;
    startRow: number;
    tableWidth: number;
    totalTables: number;
    linesPerTable: number;
    spaceBottomPerLine?: number;
}

type CalculateTableHeightParams = {
    total?: number;
    startHeight?: number;
}

export class Spreadsheet {
    private readonly workbookInstance: ExcelJS.Workbook;
    private workSheetInstance: WorkSheet | null;

    constructor() {
        this.workbookInstance = new ExcelJS.Workbook();
        this.workSheetInstance = null;
    }

    public get workBook(): ExcelJS.Workbook {
        return this.workbookInstance;
    }

    public get workSheet(): WorkSheet {
        if(!this.workSheetInstance) {
            throw new Error('Worksheet has not been initialized. Use createWorksheet first.');
        }
        return this.workSheetInstance;
    }

    public createWorkSheet(name: string): void {
        this.workSheetInstance =  new WorkSheet(this.workbookInstance.addWorksheet(name));
    }
    public updateWorkSheet(worksheet: ExcelJS.Worksheet): void {
        this.workSheetInstance =  new WorkSheet(worksheet);
    }

    public calculateTablesParamsNextRow({
        spaceTop = 1,
        startRow,
        tableWidth,
        totalTables,
        linesPerTable,
        spaceBottomPerLine = 1,
    }: CalculateTablesParamsNextRowParams): number {
        const groupRows = Math.ceil(totalTables / tableWidth);
        const totalLines = groupRows * linesPerTable;
        const totalSpaces = spaceTop + (groupRows + spaceBottomPerLine);
        return startRow + totalLines + totalSpaces;
    }


    public calculateTableHeight({ startHeight = 1, total = 0 }: CalculateTableHeightParams): number {
        return startHeight + total;
    }

    public addTables({
                         tables,
                         headers,
                         bodyStyle,
                         titleStyle,
                         tableWidth = 3,
                         spaceLines = 1,
                         blockTitle,
                         headerStyle,
                         firstTableRow = 13,
                         tableDataRows,
                         tableStartCol = [3, 8, 13],
                         blockTitleStyle,
                         tableTitleHeight = 1,
                         tableHeaderHeight = 1
                     }: TablesParams): Cell {
        const chunkedTables = chunk(tables, tableWidth);
        const blockHeight = tableTitleHeight + tableHeaderHeight + tableDataRows;

        const initialRow = blockTitle ? firstTableRow + 1 : firstTableRow;

        if(blockTitle) {
            const titleColumn = tableStartCol[0] || 1;
            this.workSheet.addCell({
                cell: firstTableRow,
                type: ECellType.SUBTITLE,
                value: blockTitle,
                styles: blockTitleStyle,
                cellColumn: titleColumn,
                merge: {
                    positions: {
                        startRow: firstTableRow,
                        endRow: firstTableRow,
                        startColumn: titleColumn,
                        endColumn: (tableStartCol[tableWidth-1] || 1) + (headers?.length ?? 1) - 1
                    }
                }
            });
        }

        const referenceCells: Array<Cell> = [];

        chunkedTables.forEach((group, index) => {
            const row = initialRow + index * (blockHeight + spaceLines);
            group.forEach((table, tableIndex) => {
                const col = tableStartCol[tableIndex] || 0;
                const label = table?.['title'] || 'title';
                const body = table?.['data'];

                const referenceCell = this.addTable({
                    title: {
                        value: label,
                        styles: titleStyle
                    },
                    startRow: row,
                    tableWidth,
                    startColumn: col || 0,
                    headers: {
                        list: headers,
                        styles: headerStyle
                    },
                    body: {
                        list: body ?? [],
                        styles: bodyStyle
                    }
                }) as Cell;
                referenceCells.push(referenceCell);
            });
        });

        return referenceCells[referenceCells.length - 1] as Cell;
    }

    public addTable(params: TableParams): Cell {
        const table = new Table(params);

        const { headers, tableWidth, startColumn } = params;

        if(table.title) {
            this.workSheet.addCell(table.title);
        }

        table.headers.forEach((header) => this.workSheet.addCell(header));
        const referenceCells = table.body.map((body) => this.workSheet.addCell(body));
        const referenceCell = referenceCells[referenceCells.length - 1] as Cell;

        (headers?.list ?? [])
            .slice(0, tableWidth)
            .forEach((_, idx) => {
                const defaultWidths = [14, 8, 8];
                this.workSheet.column(startColumn + idx).width = defaultWidths[idx] ?? 12;
            });

        return referenceCell;
    }

    public async generateSheetBuffer(): Promise<Buffer> {
        const arrayBuffer = await this.workbookInstance.xlsx.writeBuffer();
        return Buffer.from(arrayBuffer);
    }

    public async loadFile(buffer: Buffer<ArrayBufferLike>): Promise<Array<ExcelJS.Worksheet>> {
        await this.workBook.xlsx.load(buffer);
        return this.workBook.worksheets;
    }

    public parseExcelRowsToObjectList(currentRow: number, startRow: number, ignoreTitles: Array<string> = [], header: Array<string> = []): { data: Array<Record<string, string | number>>; nextRow: number;} {
        const row = this.workSheet.row(currentRow);
        const normalizedHeader = header.map(h => h.trim().toLowerCase());
        const headerMap: { [col: number]: string } = {};
        row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const header = String(cell.value).trim().toLowerCase();
            if(normalizedHeader.includes(header)) {
                headerMap[colNumber] = header;
            }
        });

        const rowNumbers = Array.from(
            { length: this.workSheet.rowCount - startRow },
            (_, idx) => idx + startRow + 1
        );

        const getCellValue = (cell: ExcelJS.Cell): string | number => {
            if(cell.value == null) {
                return '';
            }
            if (typeof cell.value === 'object' && 'result' in cell.value && cell.value.result !== undefined) {
                return cell.value.result as string | number;
            }

            return cell.value as string | number;
        };

        const rowsParsed = rowNumbers.map(rowNumber => {
            const currentRow = this.workSheet.row(rowNumber);

            if (!currentRow) {
                return null;
            }

            const obj = Object.keys(headerMap).reduce(
                (acc, key) => {
                    const colNum = Number(key);
                    const mapKey = headerMap[colNum];
                    if(mapKey) {
                        acc[mapKey] = getCellValue(currentRow.getCell(colNum));
                    }
                    return acc;
                },
                {} as Record<string, string | number>
            );

            const rowIsEmpty = Object.values(obj).every(
                value => value === null || value === undefined || value === ''
            );
            return rowIsEmpty ? null : obj;
        });

        const normalizedIgnoreTitles = ignoreTitles.map(t => t.trim().toLowerCase());
        const data: Array<Record<string, string | number>> = [];
        const totalData: Array<Record<string, string | number>> = [];
        for (const item of rowsParsed) {
            if (!item) break;
            totalData.push(item);
            const typeField = normalizedHeader.find(h => h === 'type');
            const itemTitle = typeField && typeof item[typeField] === 'string'
                ? item[typeField].trim().toLowerCase()
                : '';

            const hasHeaderValue = normalizedHeader.some(
                h => (typeof item[h] === 'string' && item[h].trim().toLowerCase() === h)
            );

            if(!hasHeaderValue && !normalizedIgnoreTitles.includes(itemTitle)) {
                data.push(item);
            }
        }

        return { data, nextRow: startRow + totalData.length + 1 + 1 };
    }



}