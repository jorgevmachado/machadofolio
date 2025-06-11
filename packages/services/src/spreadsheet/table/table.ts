import type { CellParams } from '../cell';

import type { TableParams, TableTitleParams } from './types';

export class Table {

    public readonly title?: CellParams;
    public readonly headers: Array<CellParams>;
    public readonly body: Array<CellParams>;
    private readonly hasTitle: boolean = false;

    constructor({ title, body, headers, startRow, tableWidth, startColumn }: TableParams) {
        if(title) {
            this.title = this.createTitleConfig(title, startRow, tableWidth, startColumn);
            this.hasTitle = true;
        }
        const currentStartRow = !this.hasTitle ? startRow - 1 : startRow;
        this.headers = this.createHeadersConfig(headers, currentStartRow, startColumn);
        this.body = this.createBodyConfig(body, headers.list, currentStartRow, tableWidth, startColumn);
    }

    private createTitleConfig(
        title: TableTitleParams,
        startRow: number,
        tableWidth: number,
        startColumn: number,
    ): CellParams {
        return {
            cell: startRow,
            value: title.value,
            merge: { positions: { startRow, startColumn, endRow: startRow, endColumn: startColumn + tableWidth - 1 } },
            styles: title.styles,
            cellColumn: startColumn,
        };
    }

    private createHeadersConfig(
        headers: TableParams['headers'],
        startRow: number,
        startColumn: number,
    ): Array<CellParams> {
        return headers?.list?.map((header, index) => ({
            cell: startRow + 1,
            value: header,
            styles: headers.styles,
            cellColumn: startColumn + index,
        }));
    }


    private createBodyConfig(
        body: TableParams['body'],
        headers: TableParams['headers']['list'],
        startRow: number,
        tableWidth: number,
        startColumn: number,
    ): Array<CellParams> {
        const result: Array<CellParams> = [];
        const rowList = body.list;
        const headerKeys = headers;
        rowList.forEach((row, rowIndex) => {
            headerKeys.slice(0, tableWidth).forEach((headerKey, colIndex) => {
                const rawValue = row?.[headerKey];
                const value =
                    typeof rawValue === 'boolean'
                        ? rawValue
                            ? 'YES'
                            : 'NO'
                        : rawValue ?? '';

                result.push({
                    value,
                    cell: startRow + 2 + rowIndex,
                    cellColumn: startColumn + colIndex,
                    styles: body.styles,
                });
            });
        });

        return result;
    }
}