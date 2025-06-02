import type { CellStyle } from '../cell';
import type { Position } from '../types';

export type TableConfig = {
    readonly width: number;
    readonly fontSize: number;
    readonly rowHeight: number;
    readonly initialRow: number;
    readonly tablesPerRow: number;
}

export type TableParamsConstructor = {
    body: Array<Record<string, string | number | boolean>>;
    index: number;
    title?: string;
    config: TableConfig;
    headers: Array<string>;
    tableStyle?: {
        body?: Partial<CellStyle>;
        title?: Partial<CellStyle>;
        header?: Partial<CellStyle>;
    };
    currentRow: number;
}

export type CalculateTableDimensionsParams = {
    index: number;
    config: TableConfig;
    currentRow: number;
}

export type TableDimensions = {
    readonly position: Position;
    readonly nextPosition: Position;
}