import * as ExcelJS from 'exceljs';
import { Buffer } from 'buffer';

import { chunk } from '@repo/services/array/array';

import { Cell, type CellStyles } from './cell';
import { Table, type TableParams } from './table';

type TablesParams = {
    tables: Array<any>;
    headers: Array<string>;
    bodyStyle?: Partial<CellStyles>;
    titleStyle?: Partial<CellStyles>;
    tableWidth?: number;
    spaceLines?: number;
    headerStyle?: Partial<CellStyles>;
    tableDataRows: number;
    tableStartCol?: Array<number>;
    firstTableRow?: number;
    tableTitleHeight?: number;
    tableHeaderHeight?: number;
};

export class Sheet {
    private readonly workbookInstance: ExcelJS.Workbook;
    private cellInstance: Cell | null;


    constructor() {
        this.workbookInstance = new ExcelJS.Workbook();
        this.cellInstance = null;
    }

    public get workBook(): ExcelJS.Workbook {
        return this.workbookInstance;
    }

    public get cell(): Cell {
        if (!this.cellInstance) {
            throw new Error('Worksheet não foi inicializado. Use createWorksheet primeiro.');
        }
        return this.cellInstance;
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
                     }: TablesParams) {
        const chunkedTables = chunk(tables, tableWidth);
        const blockHeight = tableTitleHeight + tableHeaderHeight + tableDataRows;

        chunkedTables.forEach((group, index) => {
            const row = firstTableRow + index * (blockHeight + spaceLines);
            group.forEach((table, tableIndex) => {
                const col = tableStartCol[tableIndex] || 0;
                const label = table?.['name'] || 'title';
                const body = table?.['data'];

                this.addTable({
                    title: {
                        value: label || '',
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
                })
            })
        })
    }

    public addTable({ title, body, headers, startRow, tableWidth, startColumn, }: TableParams) {
        const table = new Table({
            body,
            title,
            headers,
            startRow,
            tableWidth,
            startColumn,
        });
        this.cell.add(table.title);
        table.headers.forEach((header) => this.cell.add(header));
        table.body.forEach((body) => this.cell.add(body));

        (headers.list ?? [])
            .slice(0, tableWidth)
            .forEach((_, idx) => {
                const defaultWidths = [14, 8, 8];
                this.cell.column(startColumn + idx).width = defaultWidths[idx] ?? 12;
            });
    }

    createWorkSheet(name: string) {
        this.cellInstance =  new Cell(this.workbookInstance.addWorksheet(name));
    }

    public async generateSheetBuffer() {
        const arrayBuffer = await this.workbookInstance.xlsx.writeBuffer();
        return Buffer.from(arrayBuffer as ArrayBuffer);
    }
}