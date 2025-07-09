import type { CellParams, CellStyles } from '../worksheet';

export type TableParams = {
    body: Pick<CellParams, 'styles'> & {
        list: Array<Record<string, string | number | boolean>>;
    };
    title?: TableTitleParams;
    footer?: Record<string, string | number | boolean>;
    headers: Pick<CellParams, 'styles'> & {
        list: Array<string>;
    };
    startRow: number;
    tableWidth: number;
    startColumn: number;
}

export type TableTitleParams = Pick<CellParams, 'value' | 'styles'>;

export type TableData<Headers extends readonly string[]> = Array<{
    [K in Headers[number]]: string | number | boolean;
}>;

export type TableItem<Headers extends readonly string[]> = {
    title?: string;
    data: TableData<Headers>;
};

export type TablesParams<Headers extends readonly string[] = string[]> = {
    tables: Array<TableItem<Headers>>;
    headers: Headers;
    bodyStyle?: Partial<CellStyles>;
    titleStyle?: Partial<CellStyles>;
    tableWidth?: number;
    spaceLines?: number;
    blockTitle?: string;
    headerStyle?: Partial<CellStyles>;
    tableDataRows: number;
    tableStartCol?: Array<number>;
    firstTableRow?: number;
    blockTitleStyle?: Partial<CellStyles>;
    tableTitleHeight?: number;
    tableHeaderHeight?: number;
};