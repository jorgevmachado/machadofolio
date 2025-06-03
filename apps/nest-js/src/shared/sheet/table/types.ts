import type { CellParams } from '../cell';

export type TableParams = {
    body: Pick<CellParams, 'styles'> & {
        list: Array<Record<string, string | number | boolean>>;
    };
    title: Pick<CellParams, 'value' | 'styles'>;
    headers: Pick<CellParams, 'styles'> & {
        list: Array<string>;
    };
    startRow: number;
    tableWidth: number;
    startColumn: number;
}