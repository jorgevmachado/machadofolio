import * as XLSX from 'xlsx';

import type { Position } from '../types';

import type { CellParamsConstructor, CellStyle, Merge, MergePosition } from './types';

export class Cell {
    private static readonly DEFAULT_LABEL = 'B2';
    private static readonly DEFAULT_BORDER_STYLE = 'medium'
    private static readonly DEFAULT_STYLE: CellStyle = {
        font: {
            sz: 14,
            bold: true,
            name: 'Arial'
        },
        alignment: {
            vertical: 'center',
            horizontal: 'center',
            wrapText: true
        },
        borderStyle: Cell.DEFAULT_BORDER_STYLE
    };

    private readonly position?: Position;
    private readonly value: string;
    private readonly style: CellStyle;

    public cell: string;
    public merge?: Merge;

    constructor(params: CellParamsConstructor) {
        this.value = this.normalizeValue(params.value);
        this.style = this.createStyle(params.style);
        this.position = params.position;
        this.cell =this.generateCellReference(params?.label);
        this.merge = this.generateMerge(params.mergePosition);
    }

    public toXLSX(): XLSX.CellObject {
        return {
            v: this.value,
            t: 's',
            s: this.style
        };
    }

    private generateCellReference(label?: string) {
        if(!this.position) {
            return label ?? Cell.DEFAULT_LABEL;
        }
        return XLSX.utils.encode_cell({ r: this.position.row, c: this.position.column });
    }

    private normalizeValue(value: unknown): string {
        if (typeof value === 'boolean') {
            return value ? 'YES' : 'NO';
        }
        if (typeof value === 'number') {
            return String(value || '0');
        }
        return String(value || '');
    }

    private createStyle(style?: Partial<CellStyle>): CellStyle {
        return {
            font: {
                ...Cell.DEFAULT_STYLE.font,
                ...style?.font
            },
            alignment: {
                ...Cell.DEFAULT_STYLE.alignment,
                ...style?.alignment
            },
            border: this.createBorder(style?.borderStyle ?? Cell.DEFAULT_STYLE.borderStyle),
        }
    }

    private createBorder(style: string = Cell.DEFAULT_BORDER_STYLE): Required<NonNullable<CellStyle['border']>> {
        return {
            top: { style },
            left: { style },
            right: { style },
            bottom: { style },
        };
    }

    private generateMerge(position?: MergePosition): Merge | undefined {
        if(!position) {
            return;
        }
        return {
            s: { r: position.startRow, c: position.startColumn },
            e: { r: position.endRow, c: position.endColumn },
        }
    }
}
