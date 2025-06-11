import * as ExcelJS from 'exceljs';
import { Buffer } from 'buffer';

import { chunk } from '../array';

import { Table, type TableParams, type TablesParams } from './table';
import { Cell } from './cell';

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
    private cellInstance: Cell | null;

    constructor() {
        this.workbookInstance = new ExcelJS.Workbook();
        this.cellInstance = null;
    }

    public get workBook(): ExcelJS.Workbook {
        return this.workbookInstance;
    }

    public createWorkSheet(name: string): void {
        this.cellInstance =  new Cell(this.workbookInstance.addWorksheet(name));
    }

    public get cell(): Cell {
        if (!this.cellInstance) {
            throw new Error('Worksheet não foi inicializado. Use createWorksheet primeiro.');
        }
        return this.cellInstance;
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
                         headerStyle,
                         firstTableRow = 13,
                         tableDataRows,
                         tableStartCol = [3, 8, 13],
                         tableTitleHeight = 1,
                         tableHeaderHeight = 1
                     }: TablesParams): void {
        const chunkedTables = chunk(tables, tableWidth);
        const blockHeight = tableTitleHeight + tableHeaderHeight + tableDataRows;

        chunkedTables.forEach((group, index) => {
            const row = firstTableRow + index * (blockHeight + spaceLines);
            group.forEach((table, tableIndex) => {
                const col = tableStartCol[tableIndex] || 0;
                const label = table?.['title'] || 'title';
                const body = table?.['data'];

                this.addTable({
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
                });
            });
        });
    }

    public addTable({ title, body, headers, startRow, tableWidth, startColumn, }: TableParams): void {
        const table = new Table({
            body,
            title,
            headers,
            startRow,
            tableWidth,
            startColumn,
        });
        if(table.title) {
            this.cell.add(table.title);
        }
        table.headers.forEach((header) => this.cell.add(header));
        table.body.forEach((body) => this.cell.add(body));

        (headers?.list ?? [])
            .slice(0, tableWidth)
            .forEach((_, idx) => {
                const defaultWidths = [14, 8, 8];
                this.cell.column(startColumn + idx).width = defaultWidths[idx] ?? 12;
            });
    }

    public async generateSheetBuffer(): Promise<Buffer> {
        const arrayBuffer = await this.workbookInstance.xlsx.writeBuffer();
        return Buffer.from(arrayBuffer);
    }
}