import type * as ExcelJS from 'exceljs';

import type {
    CellBorderStyle,
    CellParams,
    CellStyles,
    MergeParams,
    MergeReferenceCell,
    Positions,
    ReferenceCell
} from './types';
import { ECellType } from './enum';

export class Cell {
    private readonly workSheetInstance: ExcelJS.Worksheet;

    constructor(workSheet: ExcelJS.Worksheet) {
        this.workSheetInstance = workSheet;
    }

    public add({ cell, cellColumn, value, type, styles, merge }: CellParams): ReferenceCell {
        const referenceCell: ReferenceCell = {
            row: 0,
            cell: '',
            column: 0,
            nextRow: 0,
            nextColumn: 0,
        };
        if (merge) {
            const { cellEnd, endRow, endColumn } = this.merge(merge);
            referenceCell.cell = cellEnd;
            referenceCell.row = endRow;
            referenceCell.column = endColumn;
            referenceCell.nextRow = endRow + 1;
            referenceCell.nextColumn = endColumn + 1;
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
        if(!merge) {
            const row = Number(reference.row);
            const column = Number(reference.col);
            referenceCell.cell = reference.$col$row;
            referenceCell.row = row;
            referenceCell.column = column;
            referenceCell.nextRow = row + 1;
            referenceCell.nextColumn = column + 1;
        }

        return referenceCell;
    }

    public reference(cellRoll: string | number, cellColumn?: string | number): ExcelJS.Cell {
        return this.workSheetInstance.getCell(cellRoll, cellColumn);
    }

    public merge({ cellEnd, cellStart, positions }: MergeParams): MergeReferenceCell {
        const cellReference = {
            cellStart: '',
            cellEnd: '',
            startRow: 0,
            startColumn: 0,
            endRow: 0,
            endColumn: 0
        };
        if (positions) {
            this.workSheetInstance.mergeCells(positions.startRow, positions.startColumn, positions.endRow, positions.endColumn);
            cellReference.cellStart = this.parsePositionsToCell(positions.startRow, positions.startColumn);
            cellReference.cellEnd = this.parsePositionsToCell(positions.endRow, positions.endColumn);
            cellReference.startRow = positions.startRow;
            cellReference.endRow = positions.endRow;
            cellReference.startColumn = positions.startColumn;
            cellReference.endColumn = positions.endColumn;
        }
        if (cellStart && cellEnd) {
            this.workSheetInstance.mergeCells(`${cellStart}:${cellEnd}`);
            const { row: startRow, column: startColumn } = this.parseCellToPositions(cellStart);
            const { row: endRow, column: endColumn } = this.parseCellToPositions(cellEnd);
            cellReference.cellStart = cellStart;
            cellReference.cellEnd = cellEnd;
            cellReference.startRow = startRow;
            cellReference.endRow = endRow;
            cellReference.startColumn = startColumn;
            cellReference.endColumn = endColumn;
        }
        return cellReference;
    }

    public column(value: number | string): ExcelJS.Column {
        return this.workSheetInstance.getColumn(value);
    }

    private createStyles(styles?: Partial<CellStyles>, type: CellParams['type'] = ECellType.TEXT): CellStyles {
        const cellStyles: CellStyles = {
            font: {
                name: 'Arial',
                size: 14,
                bold: false,
                color: { argb: styles?.fontColor || '000000' },
            },
            alignment: {
                wrapText: true,
                vertical: 'middle',
                horizontal: 'center',
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: styles?.fillColor || 'FFFFFFF' },
            },
        };

        switch (type) {
            case ECellType.TITLE:
                cellStyles.font.size = 24;
                cellStyles.font.bold = true;
                cellStyles.borderStyle = 'medium';
                break;
            case ECellType.SUBTITLE:
                cellStyles.font.bold = true;
                cellStyles.borderStyle = 'medium';
                break;
            case ECellType.HEADER:
                cellStyles.font.bold = true;
                cellStyles.alignment.wrapText = false;
                cellStyles.borderStyle = 'thin';
                break;
            case ECellType.BODY:
                cellStyles.font.size = 12;
                cellStyles.alignment.vertical = undefined;
                cellStyles.borderStyle = 'thin';
                break;
            case ECellType.FOOTER:
                cellStyles.font.bold = true;
                cellStyles.alignment.wrapText = false;
                cellStyles.borderStyle = 'medium';
                break;
            case ECellType.TEXT:
            default:
                break;
        }

        return {
            ...cellStyles,
            font: {
                ...cellStyles.font,
                ...styles?.font
            },
            alignment: {
                ...cellStyles.alignment,
                ...styles?.alignment
            },
            fill: {
                ...cellStyles.fill,
                ...styles?.fill
            },
            border: this.createBorder(cellStyles?.borderStyle, styles?.borderStyle, styles?.border)
        };
    }

    private createBorder(defaultCellBorderStyle?: CellBorderStyle, cellBorderStyle?: CellBorderStyle, border?: CellStyles['border']): CellStyles['border'] {
        const borderStyle = cellBorderStyle || defaultCellBorderStyle;
        if(!borderStyle) {
            return border;
        }
        return {
            top: { style: borderStyle || defaultCellBorderStyle },
            left: { style: borderStyle || defaultCellBorderStyle },
            right: { style: borderStyle || defaultCellBorderStyle },
            bottom: { style: borderStyle || defaultCellBorderStyle },
        };
    }

    private parseCellToPositions(cell: string): Positions {
        const match = cell.match(/^([A-Z]+)(\d+)$/i);
        if (!match) {
            throw new Error('Invalid cell format.');
        }

        const colLetters = match[1]!;
        const rowStr = match[2]!;

        const column = [...colLetters.toUpperCase()]
            .reduce((acc, char) => acc * 26 + (char.charCodeAt(0) - 64), 0);

        return {
            column,
            row: Number(rowStr)
        };

    }

    private parsePositionsToCell(row: number, column: number): string {
        const columnLetters = (col: number): string =>
            col <= 0
                ? ''
                : columnLetters(Math.floor((col - 1) / 26)) + String.fromCharCode(65 + ((col - 1) % 26));

        return `${columnLetters(column)}${row}`;

    }

}
