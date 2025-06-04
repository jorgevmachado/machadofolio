import type { CellParams, CellStyles } from '../cell';

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

export type TableData<Headers extends readonly string[]> = Array<{
    [K in Headers[number]]: string | number | boolean;
}>;

export type TableItem<Headers extends readonly string[]> = {
    title: string;
    data: TableData<Headers>;
};

export type TablesParams<Headers extends readonly string[] = string[]> = {
    tables: Array<TableItem<Headers>>;
    headers: Headers;
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