import type { Position } from '../types';

export type CellStyle = {
    readonly font?: Partial<CellFont>;
    readonly border?: Partial<CellBorder>;
    readonly alignment?: Partial<CellAlignment>;
    readonly borderStyle?: string;
}

type CellFont = {
    readonly sz?: number;
    readonly bold?: boolean;
    readonly name?: string;
}

export type CellBorder = {
    readonly [K in TAlignment]: { readonly style: string };
}

export type TAlignment = 'top' | 'left' | 'bottom' | 'right';

type CellAlignment = {
    readonly vertical?: 'top' | 'middle' | 'bottom' | 'center';
    readonly horizontal?: 'left' | 'center' | 'right';
    readonly wrapText?: boolean;
}

export type CellParamsConstructor = {
    value: unknown;
    style?: Partial<CellStyle>;
    label?: string;
    position?: Position;
    mergePosition?: MergePosition;
}

type MergeItem = {
    r: number;
    c: number;
}

export type Merge = {
    s: MergeItem;
    e: MergeItem;
}

export type MergePosition = {
    endRow: number;
    startRow: number;
    endColumn: number;
    startColumn: number;
}