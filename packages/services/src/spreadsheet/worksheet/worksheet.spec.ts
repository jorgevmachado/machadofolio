import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import type { CellParams, CellStyles, MergeParams } from './types';
import { ECellType } from './enum';
import { WorkSheet } from './worksheet';

describe('WorkSheet', () => {
    let mockWorkSheet: any;

    beforeEach(() => {
        mockWorkSheet = {
            getCell: jest.fn().mockReturnValue({
                value: undefined,
                font: undefined,
                alignment: undefined,
                fill: undefined,
                border: undefined,
            }),
            mergeCells: jest.fn(),
            getRow: jest.fn().mockReturnValue({}),
            getColumn: jest.fn().mockReturnValue({}),
        };
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('constructor', () => {
        it('Should constructor must associate workSheetInstance correctly.', () => {
            const worksheet = new WorkSheet(mockWorkSheet);
            expect(worksheet).toBeInstanceOf(WorkSheet);
        });
    });

    describe('addCell', () => {
        it('Should add applies values and styles, with merge.', () => {
            const worksheet = new WorkSheet(mockWorkSheet);
            const params: CellParams = {
                cell: 1,
                cellColumn: 2,
                value: 'valor',
                type: ECellType.TITLE,
                styles: {
                    fontColor: 'aabbcc',
                    alignment: { vertical: 'bottom' },
                    fillColor: 'ddeeff',
                    font: { name: 'Calibri', bold: false },
                    fill: { type: 'pattern', pattern: 'none' },
                    borderStyle: 'thin',
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' },
                        bottom: { style: 'thin' },
                    },
                },
                merge: {
                    positions: { startRow: 1, startColumn: 1, endRow: 1, endColumn: 2 },
                },
            };
            worksheet.addCell(params);

            expect(mockWorkSheet.mergeCells).toHaveBeenCalledWith(1, 1, 1, 2);

            expect(mockWorkSheet.getCell).toHaveBeenCalledWith(1, 2);
        });

        it('Should add applies values and styles, without merging.', () => {
            const worksheet = new WorkSheet(mockWorkSheet);
            const params: CellParams  = {
                cell: 3,
                cellColumn: 4,
                value: 123,
                type: ECellType.TITLE,
                styles: { fontColor: 'ffff00' },
            };
            worksheet.addCell(params);

            expect(mockWorkSheet.getCell).toHaveBeenCalledWith(3, 4);
            expect(mockWorkSheet.mergeCells).not.toHaveBeenCalled();
        });

        it('Should add applies border when createStyles returns border.', () => {
            const worksheet = new WorkSheet(mockWorkSheet);
            const params: CellParams  = {
                cell: 2,
                cellColumn: 3,
                value: 999,
                type: ECellType.TITLE,
                styles: { borderStyle: 'dotted' }
            };
            worksheet.addCell(params);

            expect(mockWorkSheet.getCell).toHaveBeenCalledWith(2, 3);
        });
    });

    describe('cell', () => {
        it('Should reference calls worksheet\'s getCell correctly.', () => {
            const worksheet = new WorkSheet(mockWorkSheet);
            worksheet.cell('A', 1);
            expect(mockWorkSheet.getCell).toHaveBeenCalledWith('A', 1);
            worksheet.cell(5, 2);
            expect(mockWorkSheet.getCell).toHaveBeenCalledWith(5, 2);
        });
    });

    describe('merge', () => {
        it('Should merge: only positions.', () => {
            const worksheet = new WorkSheet(mockWorkSheet);
            const mergeParams: MergeParams = { positions: { startRow: 1, startColumn: 2, endRow: 3, endColumn: 4 } };
            worksheet.merge(mergeParams);
            expect(mockWorkSheet.mergeCells).toHaveBeenCalledWith(1, 2, 3, 4);
        });

        it('Should merge: only cellStart and cellEnd.', () => {
            const worksheet = new WorkSheet(mockWorkSheet);
            const mergeParams: MergeParams = { cellStart: 'A1', cellEnd: 'B2' };
            worksheet.merge(mergeParams);
            expect(mockWorkSheet.mergeCells).toHaveBeenCalledWith('A1:B2');
        });

        it('Should merge: both positions and cellStart/cellEnd.', () => {
            const worksheet = new WorkSheet(mockWorkSheet);
            const mergeParams: MergeParams = {
                cellStart: 'A1',
                cellEnd: 'C3',
                positions: { startRow: 1, startColumn: 1, endRow: 3, endColumn: 3 }
            };
            worksheet.merge(mergeParams);

            expect(mockWorkSheet.mergeCells).toHaveBeenCalledWith(1, 1, 3, 3);
            expect(mockWorkSheet.mergeCells).toHaveBeenCalledWith('A1:C3');
        });

        it('Should merge: without anything, does nothing.', () => {
            const worksheet = new WorkSheet(mockWorkSheet);
            worksheet.merge({});
            expect(mockWorkSheet.mergeCells).not.toHaveBeenCalled();
        });
    });

    describe('column', () => {
        it('Should column calls getColumn from the worksheet.', () => {
            const worksheet = new WorkSheet(mockWorkSheet);
            worksheet.column(1);
            expect(mockWorkSheet.getColumn).toHaveBeenCalledWith(1);
            worksheet.column('C');
            expect(mockWorkSheet.getColumn).toHaveBeenCalledWith('C');
        });
    });

    describe('row', () => {
        it('Should row calls getRow from the worksheet.', () => {
            const worksheet = new WorkSheet(mockWorkSheet);
            worksheet.row(1);
            expect(mockWorkSheet.getRow).toHaveBeenCalledWith(1);
            worksheet.row(2);
            expect(mockWorkSheet.getRow).toHaveBeenCalledWith(2);
        });
    });

    describe('privates.', () => {
        let worksheet: WorkSheet;

        beforeEach(() => {
            worksheet = new WorkSheet(mockWorkSheet);
        });

        describe('createStyles', () => {
            it('Should createStyles: isTitle, with everything filled in.', () => {
                const result = worksheet['createStyles']({
                    fontColor: 'abc',
                    fillColor: 'fff',
                    borderStyle: 'thick',
                    font: {
                        name: 'Arial',
                        size: 24,
                        bold: true,
                        color: { argb: '000000' }
                    },
                    alignment: { wrapText: false },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFFFFF' },
                    },
                    border: undefined,
                }, ECellType.TITLE);
                expect(result.font.size).toBe(24);
                expect(result.font.bold).toBeTruthy();
                expect(result.font.name).toBe('Arial');
                expect(result.font?.color?.argb).toBe('000000');
                expect(result.alignment.wrapText).toBeFalsy();
                expect(result.fill?.fgColor?.argb).toBe('FFFFFFF');
                expect(result.border?.top?.style).toBe('thick');
            });

            it('Should createStyles with type is subtitle', () => {
                const result = worksheet['createStyles'](undefined, ECellType.SUBTITLE);
                expect(result.font.bold).toBe(true);
                expect(result.border?.top?.style).toBe('medium');
                expect(result.border?.left?.style).toBe('medium');
                expect(result.border?.right?.style).toBe('medium');
                expect(result.border?.bottom?.style).toBe('medium');
            });

            it('Should createStyles with type is header', () => {
                const result = worksheet['createStyles'](undefined, ECellType.HEADER);
                expect(result.font.bold).toBeTruthy();
                expect(result.alignment.wrapText).toBeFalsy();
                expect(result.border?.top?.style).toBe('thin');
                expect(result.border?.left?.style).toBe('thin');
                expect(result.border?.right?.style).toBe('thin');
                expect(result.border?.bottom?.style).toBe('thin');
            });

            it('Should createStyles with type is body', () => {
                const result = worksheet['createStyles'](undefined, ECellType.BODY);
                expect(result.font.size).toBe(12);
                expect(result.alignment.vertical).toBeUndefined();
                expect(result.border?.top?.style).toBe('thin');
                expect(result.border?.left?.style).toBe('thin');
                expect(result.border?.right?.style).toBe('thin');
                expect(result.border?.bottom?.style).toBe('thin');
            });

            it('Should createStyles with type is footer', () => {
                const result = worksheet['createStyles'](undefined, ECellType.FOOTER);
                expect(result.font.bold).toBeTruthy();
                expect(result.alignment.wrapText).toBeFalsy();
                expect(result.border?.top?.style).toBe('medium');
                expect(result.border?.left?.style).toBe('medium');
                expect(result.border?.right?.style).toBe('medium');
                expect(result.border?.bottom?.style).toBe('medium');
            });

            it('Should createStyles with type is text', () => {
                const result = worksheet['createStyles'](undefined, ECellType.TEXT);
                expect(result.font.bold).toBeFalsy();
                expect(result.font.size).toBe(14);
                expect(result.alignment.wrapText).toBeTruthy();
            });
        });

        describe('createBorder', () => {
            it('Should createBorder with default param', () => {

                const result = worksheet['createBorder']('medium', undefined, undefined);
                expect(result?.top.style).toBe('medium');
            });

            it('Should createBorder with cellBorderStyle.', () => {

                const result = worksheet['createBorder'](undefined, 'double', undefined);
                expect(result?.top.style).toBe('double');
            });

            it('Should createBorder with border.', () => {
                const border: CellStyles['border'] = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                    bottom: { style: 'thin' },
                };
                const result = worksheet['createBorder'](undefined, undefined, border);
                expect(result?.top.style).toBe('thin');
            });
        });

        describe('parseCellToPositions', () => {
            it('should throw error if cell format is invalid in parseCellToPositions.', () => {
                expect(() => worksheet['parseCellToPositions']('')).toThrow('Invalid cell format.');
                expect(() => worksheet['parseCellToPositions'](' ')).toThrow('Invalid cell format.');
                expect(() => worksheet['parseCellToPositions']('123')).toThrow('Invalid cell format.');
                expect(() => worksheet['parseCellToPositions']('AA')).toThrow('Invalid cell format.');
                expect(() => worksheet['parseCellToPositions']('A')).toThrow('Invalid cell format.');
                expect(() => worksheet['parseCellToPositions']('1A1')).toThrow('Invalid cell format.');
                expect(() => worksheet['parseCellToPositions']('A0B')).toThrow('Invalid cell format.');
                expect(() => worksheet['parseCellToPositions']('!!')).toThrow('Invalid cell format.');
                expect(() => worksheet['parseCellToPositions']('A-1')).toThrow('Invalid cell format.');
                expect(() => worksheet['parseCellToPositions']('A!1')).toThrow('Invalid cell format.');
            });
        });

    });
});