import type { CellParamsConstructor, CellStyle } from '../cell';

import type { CalculateTableDimensionsParams, TableDimensions, TableParamsConstructor } from './types';

export class Table {
    public readonly title: CellParamsConstructor;
    public readonly header: Array<CellParamsConstructor>;
    public readonly body: Array<CellParamsConstructor>;
    public readonly nextPositionRow: number;

    constructor({ body, index, title, config, headers, currentRow, tableStyle }: TableParamsConstructor) {
        const dimensions = this.calculateTableDimensions({ index, config, currentRow });
        this.title = this.createTitleConfig(title, dimensions.position, tableStyle?.title);
        this.header = this.createHeaderConfig(headers, dimensions.position, tableStyle?.header);
        this.body = this.createBodyConfig(body, headers, dimensions.position, tableStyle?.body);
        this.nextPositionRow = dimensions.nextPosition.row;
    }

    private calculateTableDimensions({ index, config, currentRow }: CalculateTableDimensionsParams): TableDimensions {
        const tablePosition = {
            row: currentRow + Math.floor(index / config.tablesPerRow) * config.rowHeight,
            column: (index % config.tablesPerRow) * config.width + 1,
        }

        const isLastInRow = (index + 1) % config.tablesPerRow === 0;
        const nextPosition = {
            column: isLastInRow ? 1 : tablePosition.column + config.width,
            row: isLastInRow ? tablePosition.row + config.rowHeight : tablePosition.row
        };

        return { position: tablePosition, nextPosition };
    }

    private createTitleConfig(title: string = 'title', position: TableDimensions['position'], style?: Partial<CellStyle>): CellParamsConstructor {
        return {
            value: title,
            style,
            position,
            mergePosition: {
                startRow: position.row,
                startColumn: position.column,
                endRow: position.row,
                endColumn: position.column + 2
            }
        };
    }

    private createHeaderConfig(list: TableParamsConstructor['headers'] = [], position: TableDimensions['position'], style?: Partial<CellStyle>): Array<CellParamsConstructor> {
        return list.map((value, index) => ({
            value,
            style,
            position: { row: position.row + 1, column: position.column + index }
        }))
    }

    private createBodyConfig(list: TableParamsConstructor['body'] = [], headers: Array<string> = [], position: TableDimensions['position'], style?: Partial<CellStyle>): Array<CellParamsConstructor> {
        const data = this.transformToTableBody(list, headers);
        const result: Array<CellParamsConstructor> = [];
        data.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                result.push({
                    value: cell,
                    style,
                    position: {
                        row: position.row + 2 + rowIndex,
                        column: position.column + cellIndex,
                    }
                })
            })
        });
        return result;
    }

    private transformToTableBody(list: TableParamsConstructor['body'], headers: TableParamsConstructor['headers']) {
        return list.map((item) => {
            return headers.map((header) => {
                const value = item[header];
                if (typeof value === 'boolean') {
                    return value ? 'YES' : 'NO';
                }
                if (typeof value === 'number') {
                    return String(value || '0');
                }
                return String(value || '');
            });
        })
    }
}