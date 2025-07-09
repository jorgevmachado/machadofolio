import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import * as ExcelJS from 'exceljs';

import { Buffer } from 'buffer';

import { chunk } from '../array';

import { Spreadsheet } from './spreadsheet';
import { Table } from './table';
import { WorkSheet } from './worksheet';

jest.mock('exceljs');
jest.mock('../array');
jest.mock('./worksheet');
jest.mock('./table');

describe('Spreadsheet', () => {
    const mockXlsxLoad = jest.fn();
    const workSheetRowEachCellMock = (
        opts: { includeEmpty: boolean },
        cb: (cell: { value: string }, col: number) => void
    ) => {
        cb({ value: 'Type' }, 1);
        cb({ value: 'Name' }, 2);
        cb({ value: 'Value' }, 3);
    };
    let spreadsheet: Spreadsheet;
    let workbookMock: jest.Mocked<ExcelJS.Workbook>;
    let worksheetMock: any;
    let workSheetMock: jest.Mocked<WorkSheet>;
    let tableMock: jest.Mocked<Table>;

    beforeEach(() => {
        workbookMock = {
            xlsx: { load: mockXlsxLoad },
            worksheets: ['ws1','ws2'],
            addWorksheet: jest.fn(),
        } as unknown as jest.Mocked<ExcelJS.Workbook>;
        (ExcelJS.Workbook as unknown as jest.Mock).mockImplementation(() => workbookMock);

        worksheetMock = {};

        workSheetMock = {
            row: (rowNumber: number) => ({
                getCell: (colNum: number) => {
                    if (rowNumber === 2) {
                        if (colNum === 1) return { value: 'expense' };
                        if (colNum === 2) return { value: 'Lyla' };
                        if (colNum === 3) return { value: 200 };
                    }
                    return { value: null };
                },
                eachCell: workSheetRowEachCellMock
            }),
            addCell: jest.fn(),
            column: jest.fn().mockReturnValue({ width: 0 }),
            rowCount: 2,
        } as unknown as jest.Mocked<WorkSheet>;
        (WorkSheet as unknown as jest.Mock).mockImplementation(() => workSheetMock);

        tableMock = {
            title: { value: '', styles: {} },
            headers: [{ value: '', styles: {} }],
            body: [{ value: '', styles: {} }],
        } as unknown as jest.Mocked<Table>;
        (Table as unknown as jest.Mock).mockImplementation(() => tableMock);


        (chunk as jest.Mock).mockReturnValue([[{ title: 'Anything', data: [{ a: 1 }] }]]);

        spreadsheet = new Spreadsheet();
        (workbookMock.addWorksheet as jest.Mock).mockReturnValue(worksheetMock);

        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('constructor', () => {
        it('must correctly instantiate all instances.', () => {
            expect(spreadsheet['workbookInstance']).toBeInstanceOf(Object);
            expect(spreadsheet['workSheetInstance']).toBeNull();
            expect(spreadsheet.workBook).toBe(workbookMock);
        });
    });

    describe('WorkSheet', () => {
        it('get WorkSheet should throw error if there is no worksheet.', () => {
            expect(() => spreadsheet.workSheet).toThrow('Worksheet has not been initialized. Use createWorksheet first.');
        });

        it('get WorkSheet should return workSheetInstance if any.', () => {
            spreadsheet.createWorkSheet('Spreadsheet2');
            expect(spreadsheet.workSheet).toBe(workSheetMock);
        });

        it('must create worksheet and instantiate WorkSheet.', () => {
            spreadsheet.createWorkSheet('MySpreadsheet');
            expect(workbookMock.addWorksheet).toHaveBeenCalledWith('MySpreadsheet');
            expect(WorkSheet).toHaveBeenCalledWith(worksheetMock);
            expect(spreadsheet['workSheetInstance']).toBe(workSheetMock);
        });

        it('must update worksheet and instantiate WorkSheet.', () => {
            spreadsheet.updateWorkSheet(worksheetMock);
            expect(WorkSheet).toHaveBeenCalledWith(worksheetMock);
            expect(spreadsheet['workSheetInstance']).toBe(workSheetMock);
        });

    });

    describe('addTables', () => {
        beforeEach(() => {
            spreadsheet.createWorkSheet('AnySpreadsheet');
            jest.spyOn(spreadsheet, 'addTable').mockImplementation(jest.fn() as any);
        });

        it('must call chunk with default width.', () => {
            const tables = [{ title: 'foo', data: [{ x: 1 }] }];
            spreadsheet.addTables({
                tables,
                headers: ['a'],
                tableDataRows: 2,
            });
            expect(chunk).toHaveBeenCalledWith(tables, 3);
        });

        it('must process with all parameters.', () => {
            const tables = [{ title: 'abc', data: [] }];
            spreadsheet.addTables({
                tables,
                headers: ['col'],
                bodyStyle: {},
                titleStyle: {},
                tableWidth: 2,
                spaceLines: 2,
                headerStyle: {},
                tableDataRows: 1,
                tableStartCol: [1, 10],
                firstTableRow: 5,
                tableTitleHeight: 3,
                tableHeaderHeight: 2,
            });
            expect(chunk).toHaveBeenCalledWith(tables, 2);
            expect(spreadsheet.addTable).toHaveBeenCalled();
        });

        it('uses startColumn=0 when tableStartCol[tableIndex] is undefined.', () => {
            (chunk as jest.Mock).mockReturnValue([
                [
                    { title: 't1', data: [1] },
                    { title: 't2', data: [2] },
                ],
            ]);

            spreadsheet.addTables({
                tables: [
                    { title: 't1', data: [{}] },
                    { title: 't2', data: [{}] },
                ],
                headers: ['a'],
                tableDataRows: 1,
                tableStartCol: [5],
            });

            expect((spreadsheet.addTable as jest.Mock).mock.calls[1][0]['startColumn']).toBe(0);
            expect((spreadsheet.addTable as jest.Mock).mock.calls[0][0]['startColumn']).toBe(5);
        });

        it('uses "title" when table.title is undefined.', () => {
            (chunk as jest.Mock).mockReturnValue([
                [{ data: [1] }],
            ]);

            spreadsheet.addTables({
                tables: [
                    {
                        data: [{}],
                        title: undefined
                    },
                ],
                headers: ['a'],
                tableDataRows: 1,
            });

            expect((spreadsheet.addTable as jest.Mock).mock.calls[0][0]['title'].value).toBe('title');
        });

        it('use [] as body when table.data is undefined.', () => {
            (chunk as jest.Mock).mockReturnValue([
                [{ title: 'qualquer', data: undefined }],
            ]);

            spreadsheet.addTables({
                tables: [{ title: 'qualquer', data: undefined }],
                headers: ['a'],
                tableDataRows: 1,
            });

            expect((spreadsheet.addTable as jest.Mock).mock.calls[0][0]['body'].list).toEqual([]);
        });

        it('guarantees all defaults in a combined manner.', () => {
            (chunk as jest.Mock).mockReturnValue([
                [{}, {}, { title: undefined, data: undefined }],
            ]);

            spreadsheet.addTables({
                tables: [undefined, undefined, { title: undefined, data: undefined }],
                headers: ['a'],
                tableDataRows: 1,
                tableStartCol: [],
            });

            expect((spreadsheet.addTable as jest.Mock).mock.calls[0][0]['startColumn']).toBe(0);
            expect((spreadsheet.addTable as jest.Mock).mock.calls[1][0]['startColumn']).toBe(0);
            expect((spreadsheet.addTable as jest.Mock).mock.calls[2][0]['startColumn']).toBe(0);
            expect((spreadsheet.addTable as jest.Mock).mock.calls[0][0]['title'].value).toBe('title');
            expect((spreadsheet.addTable as jest.Mock).mock.calls[1][0]['title'].value).toBe('title');
            expect((spreadsheet.addTable as jest.Mock).mock.calls[2][0]['title'].value).toBe('title');
            expect((spreadsheet.addTable as jest.Mock).mock.calls[0][0]['body'].list).toEqual([]);
            expect((spreadsheet.addTable as jest.Mock).mock.calls[1][0]['body'].list).toEqual([]);
            expect((spreadsheet.addTable as jest.Mock).mock.calls[2][0]['body'].list).toEqual([]);
        });

        it('should create tables with blockTitle.', () => {
            const tables = [{ title: 'abc', data: [] }];
            spreadsheet.addTables({
                tables,
                headers: ['col'],
                bodyStyle: {},
                titleStyle: {},
                tableWidth: 2,
                spaceLines: 2,
                blockTitle: 'block title',
                headerStyle: {},
                tableDataRows: 1,
                tableStartCol: [1, 10],
                firstTableRow: 5,
                tableTitleHeight: 3,
                tableHeaderHeight: 2,
            });
            expect(chunk).toHaveBeenCalledWith(tables, 2);
            expect(spreadsheet.addTable).toHaveBeenCalled();
        });

        it('should create tables with blockTitle with default fields.', () => {
            const tables = [{ title: 'abc', data: [] }];
            spreadsheet.addTables({
                tables,
                headers: undefined,
                bodyStyle: {},
                titleStyle: {},
                tableWidth: 0,
                spaceLines: 2,
                blockTitle: 'block title',
                headerStyle: {},
                tableDataRows: 1,
                tableStartCol: [],
                firstTableRow: 5,
                tableTitleHeight: 3,
                tableHeaderHeight: 2,
            });
            expect(chunk).toHaveBeenCalledWith(tables, 0);
            expect(spreadsheet.addTable).toHaveBeenCalled();
        });

    });

    describe('addTable', () => {
        beforeEach(() => {
            spreadsheet.createWorkSheet('SpreadsheetWidth');
            spreadsheet['workSheetInstance'] = workSheetMock;
        });

        it('Should add titles, headers, body and set column widths.', () => {
            spreadsheet.addTable({
                    title: { value: 'Teste', styles: {} },
                    body: { list: [{}], styles: {} },
                    headers: { list: [''], styles: {} },
                    startRow: 1,
                    tableWidth: 1,
                    startColumn: 0,
                }
            );

            expect(workSheetMock.addCell).toHaveBeenCalledTimes(3);
            expect(workSheetMock.column).toHaveBeenCalledWith(0);
        });

        it('fill with 12 if tableWidth exceeds defaultWidths.', () => {
            spreadsheet.addTable({
                title: { value: 'larger', styles: {} },
                body: { list: [], styles: {} },
                headers: { list: ['a', 'b', 'c', 'd'], styles: {} },
                startRow: 1,
                tableWidth: 4,
                startColumn: 0,
            });

            expect(workSheetMock.column).toHaveBeenCalledWith(0);
            expect(workSheetMock.column).toHaveBeenCalledWith(1);
            expect(workSheetMock.column).toHaveBeenCalledWith(2);
            expect(workSheetMock.column).toHaveBeenCalledWith(3);

            expect(workSheetMock.column(3).width).toBe(12);
        });

        it('uses headers = [] if undefined (?? []).', () => {
            spreadsheet.addTable({
                title: { value: 'no headers', styles: {} },
                body: { list: [], styles: {} },
                headers: undefined,
                startRow: 1,
                tableWidth: 2,
                startColumn: 0,
            });
            expect(workSheetMock.column).not.toHaveBeenCalled();
        });


    });

    describe('generateSheetBuffer', () => {
        let spreadsheet: Spreadsheet;
        let workbookMock: jest.Mocked<ExcelJS.Workbook>;

        beforeEach(() => {
            workbookMock = {
                addWorksheet: jest.fn(),
                xlsx: {
                    writeBuffer: jest.fn(),
                },
            } as unknown as jest.Mocked<ExcelJS.Workbook>;

            (ExcelJS.Workbook as unknown as jest.Mock).mockImplementation(() => workbookMock);
            spreadsheet = new Spreadsheet();
        });

        it('must call writeBuffer on the workbook and return a Buffer.', async () => {
            const arrayBuffer = Uint8Array.from([1, 2, 3]).buffer;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            (workbookMock.xlsx.writeBuffer as jest.Mock).mockResolvedValue(arrayBuffer);

            const bufferFromSpy = jest.spyOn(Buffer, 'from').mockReturnValue(Buffer.alloc(3));

            const result = await spreadsheet.generateSheetBuffer();

            expect(workbookMock.xlsx.writeBuffer).toHaveBeenCalledTimes(1);
            expect(bufferFromSpy).toHaveBeenCalledWith(arrayBuffer);
            expect(Buffer.isBuffer(result)).toBe(true);

            bufferFromSpy.mockRestore();
        });
    });

    describe('calculateTablesParamsNextRow', () => {
        const defaultCalculateTablesParamsNextRowParams = {
            spaceTop: undefined,
            startRow: 19,
            tableWidth: 3,
            totalTables: 6,
            linesPerTable: 14,
            spaceBottomPerLine: undefined,
        };
        it('Should calculate tables next row successfully', () => {
            expect(spreadsheet.calculateTablesParamsNextRow(defaultCalculateTablesParamsNextRowParams)).toEqual(51);
        });
    });

    describe('calculateTableHeight', () => {
        const defaultCalculateTableHeightParams = {
            total: 10,
            startHeight: 1
        };
        it('Should calculate table height successfully', () => {
            expect(spreadsheet.calculateTableHeight(defaultCalculateTableHeightParams)).toEqual(11);
        });

        it('Should calculate table height successfully with default values', () => {
            expect(spreadsheet.calculateTableHeight({})).toEqual(1);
        });
    });

    describe('loadFile', () => {
        it('must load the file and return the spreadsheets.', async () => {
            const fakeBuffer = Buffer.from('anything') as Buffer;

            const result = await spreadsheet.loadFile(fakeBuffer);

            expect(result).toEqual(['ws1', 'ws2']);
        });

    });

    describe('parseExcelRowsToObjectList', () => {
        it('should correctly map lines to objects.', () => {
            spreadsheet.createWorkSheet('Spreadsheet2');
            const result = spreadsheet.parseExcelRowsToObjectList(
                14,
                1,
                [],
                ['Type', 'Name', 'Value']
            );

            expect(result.data).toEqual([
                { type: 'expense', name: 'Lyla', value: 200 }
            ]);

            expect(result.nextRow).toBe(4);
        });

        it('should ignore lines by ignoreTitles.', () => {
            spreadsheet.createWorkSheet('Spreadsheet2');
            const result = spreadsheet.parseExcelRowsToObjectList(
                14,
                1,
                ['expense'],
                ['Type', 'Name', 'Value'],
            );

            expect(result.data).toEqual([]);
        });

        it('should ignore lines that are repeated headers.', () => {
            spreadsheet.createWorkSheet('Spreadsheet2');
            spreadsheet.workSheet.row = (n: number) => ({
                getCell: (colNum: number) => ({
                    value:
                        colNum === 1
                            ? 'Type'
                            : colNum === 2
                                ? 'Name'
                                : 'Value'
                }),
                eachCell: workSheetRowEachCellMock
            }) as any;

            const result = spreadsheet.parseExcelRowsToObjectList(
                14,
                1,
                [],
                ['Type', 'Name', 'Value']
            );
            expect(result.data).toEqual([]);
        });

        it('should return empty if there are no valid rows.', () => {
            spreadsheet.createWorkSheet('Spreadsheet2');

            spreadsheet.workSheet.row = (rowNumber: number) => {
                if(rowNumber === 2) {
                    return null;
                }
                return {
                    getCell: (colNum: number) => {
                        if (rowNumber === 14) {
                            if (colNum === 1) return { value: 'expense' };
                            if (colNum === 2) return { value: 'Lyla' };
                            if (colNum === 3) return { value: 200 };
                        }
                        return { value: null };
                    },
                    eachCell: workSheetRowEachCellMock
                } as any;
            };

            // spreadsheet.workSheet.row = (_: number) => null as any;


            const result = spreadsheet.parseExcelRowsToObjectList(
                14,
                1,
                [],
                ['col1']
            );
            expect(result.data).toEqual([]);
        });

        it('must handle cell values of type object with result property.', () => {
            spreadsheet.createWorkSheet('Spreadsheet2');
            spreadsheet.workSheet.row = (rowNum: number) => ({
                getCell: (colNum: number) => ({
                    value:
                        colNum === 1
                            ? { result: 'expense' }
                            : colNum === 2
                                ? { result: 'Lyla' }
                                : { result: 200 }
                }),
                eachCell: workSheetRowEachCellMock
            }) as any;

            const result = spreadsheet.parseExcelRowsToObjectList(
                14,
                1,
                [],
                ['Type', 'Name', 'Value']
            );
            expect(result.data).toEqual([
                { type: 'expense', name: 'Lyla', value: 200 }
            ]);
        });

        it('returns "" when getCell returns value == null.', () => {
            spreadsheet.createWorkSheet('Spreadsheet2');
            spreadsheet.workSheet.row = (rowNum: number) => ({
                getCell: (col: number) => ({ value: null }),
                eachCell: (opt: any, fn: (cell: any, colNumber: number) => void) => {
                    fn({ value: 'col1' }, 1);
                }
            }) as any;

            const result = spreadsheet.parseExcelRowsToObjectList(
                14,
                1,
                [],
                ['col1']
            );

            expect(result.data).toEqual([]);
        });

        it('returns "" for itemTitle if typeKey exists but value is not string', () => {
            spreadsheet.createWorkSheet('Spreadsheet2');
            spreadsheet.workSheet.row = (rowNum: number) => {
                if(rowNum === 2) {
                    return {
                        getCell: (col: number) => col === 1
                            ? { value: 99 } // Não é string!!
                            : { value: 'data' },
                        eachCell: (opt: any, fn: (cell: any, colNumber: number) => void) => {
                            fn({ value: 'type' }, 1);
                            fn({ value: 'col2' }, 2);
                        }
                    } as any;
                }
                return { getCell: () => ({ value: null }), eachCell: (opt: any, fn: (cell: any, colNumber: number) => void) => {
                        fn({ value: 'type' }, 1);
                        fn({ value: 'col2' }, 2);
                    } } as any;
            };

            const result = spreadsheet.parseExcelRowsToObjectList(
                14,
                1,
                [],
                ['type', 'col2']
            );
            expect(result.data.length).toBe(1);
            expect(result.data[0]).toEqual({ type: 99, col2: 'data' });
        });
    });

});