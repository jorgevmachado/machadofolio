import { type CellParams, ECellType } from '../worksheet';

import type { TableParams, TableTitleParams } from './types';

export class Table {

    public readonly title?: CellParams;
    public readonly headers: Array<CellParams>;
    public readonly body: Array<CellParams>;
    private readonly hasTitle: boolean = false;

    constructor({ title, body, headers, footer, startRow, tableWidth, startColumn }: TableParams) {
        if(title) {
            this.title = this.createTitleConfig(title, startRow, tableWidth, startColumn);
            this.hasTitle = true;
        }
        const currentStartRow = !this.hasTitle ? startRow - 1 : startRow;
        this.headers = this.createHeadersConfig(headers, currentStartRow, startColumn);
        this.body = this.createBodyConfig(body, headers.list, currentStartRow, tableWidth, startColumn, footer);
    }

    private createTitleConfig(
        title: TableTitleParams,
        startRow: number,
        tableWidth: number,
        startColumn: number,
    ): CellParams {
        return {
            cell: startRow,
            type: ECellType.SUBTITLE,
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
            type: ECellType.HEADER,
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
        footer?: TableParams['footer'],
    ): Array<CellParams> {
        const result: Array<CellParams> = [];
        const rowList = footer ? [...body.list, footer] : body.list;
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
                    type: row?.['footer'] ? ECellType.FOOTER : ECellType.BODY,
                    cellColumn: startColumn + colIndex,
                    styles: body.styles,
                });
            });
        });

        return result;
    }
}