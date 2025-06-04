import type * as ExcelJS from 'exceljs';

import type { CellBorderStyle, CellParams, CellStyles, MergeParams } from './types';

export class Cell {
    private readonly workSheetInstance: ExcelJS.Worksheet;

    constructor(workSheet: ExcelJS.Worksheet) {
        this.workSheetInstance = workSheet;
    }

    public add({ cell, cellColumn, value, type, styles, merge }: CellParams): void {
        if (merge) {
            this.merge(merge);
        }
        const reference = this.reference(cell, cellColumn);
        reference.value = value;
        const { font, alignment, fill, border } = this.createStyles(styles, type);
        reference.font = font;
        reference.alignment = alignment;
        reference.fill = fill;
        if (border) {
            reference.border = border;
        }
    }

    public reference(cellRoll: string | number, cellColumn?: string | number): ExcelJS.Cell {
        return this.workSheetInstance.getCell(cellRoll, cellColumn);
    }

    public merge({ cellEnd, cellStart, positions }: MergeParams): void {
        if (positions) {
            this.workSheetInstance.mergeCells(positions.startRow, positions.startColumn, positions.endRow, positions.endColumn);
        }
        if (cellStart && cellEnd) {
            this.workSheetInstance.mergeCells(`${cellStart}:${cellEnd}`);
        }
        return;
    }

    public column(value: number | string): ExcelJS.Column {
        return this.workSheetInstance.getColumn(value);
    }

    private createStyles(styles?: Partial<CellStyles>, type: CellParams['type'] = 'text'): CellStyles {
        const isTitle = type === 'title';
        return {
            font: {
                name: 'Arial',
                size: isTitle ? 24 : 14,
                bold: isTitle,
                color: { argb: styles?.fontColor || '000000' },
                ...styles?.font
            },
            alignment: {
                wrapText: true,
                vertical: 'middle',
                horizontal: 'center',
                ...styles?.alignment
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: styles?.fillColor || 'FFFFFFF' },
                ...styles?.fill
            },
            border: this.createBorder(type, styles?.borderStyle, styles?.border)
        };
    }

    private createBorder(type: CellParams['type'], borderStyle?: CellBorderStyle, border?: CellStyles['border']): CellStyles['border'] {
        const defaultCellBorderStyle = 'medium';
        if (type === 'title') {
            return {
                top: { style: borderStyle || defaultCellBorderStyle },
                left: { style: borderStyle || defaultCellBorderStyle },
                right: { style: borderStyle || defaultCellBorderStyle },
                bottom: { style: borderStyle || defaultCellBorderStyle },
            };
        }
        if (borderStyle) {
            return {
                top: { style: borderStyle },
                left: { style: borderStyle },
                right: { style: borderStyle },
                bottom: { style: borderStyle },
            };
        }
        return border;
    }

}
