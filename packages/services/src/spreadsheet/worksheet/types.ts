import type { ECellType } from './enum';

export type CellParams = {
    cell: string | number;
    cellColumn?: string | number;
    type?: TCell;
    value: string | number | boolean;
    merge?: MergeParams;
    styles?: Partial<CellStyles>;
}

export type TCell = ECellType;

export type MergeParams = {
    cellEnd?: string;
    cellStart?: string;
    positions?: {
        endRow: number;
        startRow: number;
        endColumn: number;
        startColumn: number;
    }
}

export type CellStyles = {
    fill: FillStyles;
    fillColor?: string;
    font: FontStyles;
    fontColor?: string;
    border?: BorderStyles;
    alignment: AlignmentStyle;
    borderStyle?: TBorderStyle;
}

type FillStyles = {
    type: 'pattern';
    pattern: | 'none' | 'solid' | 'darkVertical' | 'darkHorizontal' | 'darkGrid' | 'darkTrellis' | 'darkDown' | 'darkUp' | 'lightVertical' | 'lightHorizontal' | 'lightGrid' | 'lightTrellis' | 'lightDown' | 'lightUp' | 'darkGray' | 'mediumGray' | 'lightGray' | 'gray125' | 'gray0625';
    fgColor?: ColorStyle;
}

type FontStyles = {
    name?: string;
    size?: number;
    bold?: boolean;
    color?: ColorStyle;
}

type ColorStyle = {
    argb: string;
};

type BorderStyles = {
    top: { style: TBorderStyle; };
    left: { style: TBorderStyle; };
    bottom: { style: TBorderStyle; };
    right: { style: TBorderStyle; };
}

type AlignmentStyle = {
    vertical?: 'top' | 'middle' | 'bottom' | 'distributed' | 'justify';
    wrapText?: boolean;
    horizontal?: 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
}

type TBorderStyle = | 'thin' | 'dotted' | 'hair' | 'medium' | 'double' | 'thick' | 'dashed' | 'dashDot' | 'dashDotDot' | 'slantDashDot' | 'mediumDashed' | 'mediumDashDotDot' | 'mediumDashDot';

export type CellBorderStyle = | 'thin' | 'dotted' | 'hair' | 'medium' | 'double' | 'thick' | 'dashed' | 'dashDot' | 'dashDotDot' | 'slantDashDot' | 'mediumDashed' | 'mediumDashDotDot' | 'mediumDashDot';

export type Cell = {
    row: number;
    cell: string;
    column: number;
    nextRow: number;
    nextColumn: number;
}

export type MergeCell = {
    endRow: number;
    cellEnd: string;
    startRow: number;
    cellStart: string;
    endColumn: number;
    startColumn: number;
}

export type Positions = {
    row: number;
    column: number;
}