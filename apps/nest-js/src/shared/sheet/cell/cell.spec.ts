import { Cell } from './cell';

describe('Cell', () => {
    let mockWorksheet: any;

    beforeEach(() => {
        mockWorksheet = {
            getCell: jest.fn().mockReturnValue({
                value: undefined,
                font: undefined,
                alignment: undefined,
                fill: undefined,
                border: undefined,
            }),
            mergeCells: jest.fn(),
            getColumn: jest.fn().mockReturnValue({}),
        };
    });

    describe('constructor', () => {
        it('Should constructor must associate workSheetInstance correctly.', () => {
            const cell = new Cell(mockWorksheet);
            expect(cell).toBeInstanceOf(Cell);
        });
    });


    describe('add', () => {
        it('Should add applies values and styles, with merge.', () => {
            const cell = new Cell(mockWorksheet);
            const params = {
                cell: 1,
                cellColumn: 2,
                value: 'valor',
                type: 'title',
                styles: {
                    fontColor: 'aabbcc',
                    alignment: { vertical: 'bottom' },
                    fillColor: 'ddeeff',
                    font: { name: 'Calibri', bold: false },
                    fill: { pattern: 'none' },
                    borderStyle: 'thin',
                    border: { top: { style: 'thin' } },
                },
                merge: {
                    positions: { startRow: 1, startColumn: 1, endRow: 1, endColumn: 2 },
                },
            };
            cell.add(params as any);

            // Merge chamado
            expect(mockWorksheet.mergeCells).toHaveBeenCalledWith(1, 1, 1, 2);
            // getCell chamado corretamente
            expect(mockWorksheet.getCell).toHaveBeenCalledWith(1, 2);
        });

        it('Should add applies values and styles, without merging.', () => {
            const cell = new Cell(mockWorksheet);
            const params = {
                cell: 3,
                cellColumn: 4,
                value: 123,
                type: 'text',
                styles: { fontColor: 'ffff00' },
            };
            cell.add(params as any);

            expect(mockWorksheet.getCell).toHaveBeenCalledWith(3, 4);
            expect(mockWorksheet.mergeCells).not.toHaveBeenCalled();
        });

        it('Should add applies border when createStyles returns border.', () => {
            const cell = new Cell(mockWorksheet);
            const params = {
                cell: 2, cellColumn: 3, value: 999, type: 'title', styles: { borderStyle: 'dotted' }
            };
            cell.add(params as any);

            expect(mockWorksheet.getCell).toHaveBeenCalledWith(2, 3);
        });
    });

    describe('reference', () => {
        it('Should reference calls worksheet\'s getCell correctly.', () => {
            const cell = new Cell(mockWorksheet);
            cell.reference('A', 1);
            expect(mockWorksheet.getCell).toHaveBeenCalledWith('A', 1);
            cell.reference(5, 2);
            expect(mockWorksheet.getCell).toHaveBeenCalledWith(5, 2);
        });
    });

    describe('merge', () => {
        it('Should merge: only positions.', () => {
            const cell = new Cell(mockWorksheet);
            const mergeParams = { positions: { startRow: 1, startColumn: 2, endRow: 3, endColumn: 4 } };
            cell.merge(mergeParams as any);
            expect(mockWorksheet.mergeCells).toHaveBeenCalledWith(1, 2, 3, 4);
        });

        it('Should merge: only cellStart and cellEnd.', () => {
            const cell = new Cell(mockWorksheet);
            const mergeParams = { cellStart: 'A1', cellEnd: 'B2' };
            cell.merge(mergeParams as any);
            expect(mockWorksheet.mergeCells).toHaveBeenCalledWith('A1:B2');
        });

        it('Should merge: both positions and cellStart/cellEnd.', () => {
            const cell = new Cell(mockWorksheet);
            const mergeParams = {
                cellStart: 'A1',
                cellEnd: 'C3',
                positions: { startRow: 1, startColumn: 1, endRow: 3, endColumn: 3 }
            };
            cell.merge(mergeParams as any);

            expect(mockWorksheet.mergeCells).toHaveBeenCalledWith(1, 1, 3, 3);
            expect(mockWorksheet.mergeCells).toHaveBeenCalledWith('A1:C3');
        });

        it('Should merge: without anything, does nothing.', () => {
            const cell = new Cell(mockWorksheet);
            cell.merge({} as any);
            expect(mockWorksheet.mergeCells).not.toHaveBeenCalled();
        });
    });

    describe('column', () => {
        it('Should column calls getColumn from the worksheet.', () => {
            const cell = new Cell(mockWorksheet);
            cell.column(1);
            expect(mockWorksheet.getColumn).toHaveBeenCalledWith(1);
            cell.column('C');
            expect(mockWorksheet.getColumn).toHaveBeenCalledWith('C');
        });
    });

    describe('createStyles and createBorder (private).', () => {
        let cell: Cell;

        beforeEach(() => {
            cell = new Cell(mockWorksheet);
        });

        it('Should createStyles: isTitle, with everything filled in.', () => {
            const result = cell['createStyles']({
                fontColor: 'abc',
                fillColor: 'fff',
                borderStyle: 'thick',
                font: {
                    name: 'Arial',
                    size: 24,
                    bold: true,
                    color: { argb: '000000'}
                },
                alignment: { wrapText: false },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFFF' },
                },
                border: undefined,
            }, 'title');
            expect(result.font.size).toBe(24);
            expect(result.font.bold).toBe(true);
            expect(result.font.name).toBe('Arial');
            expect(result.font?.color?.argb).toBe('000000');
            expect(result.alignment.wrapText).toBe(false);
            expect(result.fill?.fgColor?.argb).toBe('FFFFFFF');
            expect(result.border?.top?.style).toBe('thick');
        });

        it('Should createStyles: no title, default values.', () => {
            
            const result = cell['createStyles']({}, 'text');
            expect(result.font.size).toBe(14);
            expect(result.font.bold).toBe(false);
            expect(result.font?.color?.argb).toBe('000000');
            expect(result.fill?.fgColor?.argb).toBe('FFFFFFF');
            expect(result.border).toBeUndefined();
        });

        it('Should createBorder: para title', () => {
            
            const result = cell['createBorder']('title', undefined, undefined);
            expect(result?.top.style).toBe('medium');
        });

        it('Should createBorder: for title.', () => {
            
            const result = cell['createBorder']('title', 'double', undefined);
            expect(result?.top.style).toBe('double');
        });

        it('Should createBorder: for non-title, borderStyle.', () => {
            
            const result = cell['createBorder']('text', 'thin', undefined);
            expect(result?.top.style).toBe('thin');
        });
    });
});