import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import * as ExcelJS from 'exceljs';

import { Buffer } from 'buffer';

import { chunk } from '../array';

import { Cell } from './cell';
import { Spreadsheet } from './spreadsheet';
import { Table } from './table';

jest.mock('exceljs');
jest.mock('../array');
jest.mock('./cell');
jest.mock('./table');

describe('Spreadsheet', () => {
    let spreadsheet: Spreadsheet;
    let workbookMock: jest.Mocked<ExcelJS.Workbook>;
    let worksheetMock: any;
    let cellMock: jest.Mocked<Cell>;
    let tableMock: jest.Mocked<Table>;


    beforeEach(() => {
        workbookMock = {
            addWorksheet: jest.fn(),
        } as unknown as jest.Mocked<ExcelJS.Workbook>;

        (ExcelJS.Workbook as unknown as jest.Mock).mockImplementation(() => workbookMock);

        worksheetMock = {};

        cellMock = {
            add: jest.fn(),
            column: jest.fn().mockReturnValue({ width: 0 }),
        } as unknown as jest.Mocked<Cell>;
        (Cell as unknown as jest.Mock).mockImplementation(() => cellMock);

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
        it('deve instanciar corretamente', () => {
            expect((spreadsheet as any).workbookInstance).toBeInstanceOf(Object);
            expect((spreadsheet as any).cellInstance).toBeNull();
            expect(spreadsheet.workBook).toBe(workbookMock);
        });
    });

    describe('createWorkSheet', () => {
        it('deve criar worksheet e instanciar Cell', () => {
            spreadsheet.createWorkSheet('MinhaPlanilha');
            expect(workbookMock.addWorksheet).toHaveBeenCalledWith('MinhaPlanilha');
            expect(Cell).toHaveBeenCalledWith(worksheetMock);
            expect((spreadsheet as any).cellInstance).toBe(cellMock);
        });
    });

    describe('cell', () => {
        it('get cell deve lançar erro se não houver worksheet', () => {
            expect(() => spreadsheet.cell).toThrow('Worksheet não foi inicializado. Use createWorksheet primeiro.');
        });
        it('get cell deve retornar cellInstance se houver', () => {
            spreadsheet.createWorkSheet('Planilha2');
            expect(spreadsheet.cell).toBe(cellMock);
        });

    });

    describe('addTables', () => {
        beforeEach(() => {
            spreadsheet.createWorkSheet('QualquerPlanilha');
            jest.spyOn(spreadsheet, 'addTable').mockImplementation(jest.fn());
        });

        it('deve chamar chunk com largura padrão', () => {
            const tables = [{ title: 'foo', data: [{ x: 1 }] }];
            spreadsheet.addTables({
                tables,
                headers: ['a'],
                tableDataRows: 2,
            });
            expect(chunk).toHaveBeenCalledWith(tables, 3);
        });

        it('deve processar com todos os parâmetros', () => {
            const tables = [{ title: 'abc', data: [] }];
            spreadsheet.addTables({
                tables,
                headers: ['col'],
                tableDataRows: 1,
                tableWidth: 2,
                firstTableRow: 5,
                spaceLines: 2,
                tableStartCol: [1, 10],
                headerStyle: {},
                bodyStyle: {},
                titleStyle: {},
                tableHeaderHeight: 2,
                tableTitleHeight: 3,
            });
            expect(chunk).toHaveBeenCalledWith(tables, 2);
            expect(spreadsheet.addTable).toHaveBeenCalled();
        });

        it('usa startColumn=0 quando tableStartCol[tableIndex] for undefined', () => {
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

        it('usa "title" quando table.title for undefined', () => {
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

        it('usa [] como body quando table.data for undefined', () => {
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

        it('garante todos defaults de forma combinada', () => {
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

    });

    describe('addTable', () => {
        beforeEach(() => {
            spreadsheet.createWorkSheet('LarguraPlanilha');
            (spreadsheet as any).cellInstance = cellMock;
        });

        it('addTable deve adicionar títulos, headers, body e setar width das colunas', () => {
            spreadsheet.addTable({
                    title: { value: 'Teste', styles: {} },
                    body: { list: [{}], styles: {} },
                    headers: { list: [''], styles: {} },
                    startRow: 1,
                    tableWidth: 1,
                    startColumn: 0,
                }
            );

            expect(cellMock.add).toHaveBeenCalledTimes(3);
            expect(cellMock.column).toHaveBeenCalledWith(0);
        });

        it('preenche com 12 se tableWidth excede defaultWidths', () => {
            spreadsheet.addTable({
                title: { value: 'larger', styles: {} },
                body: { list: [], styles: {} },
                headers: { list: ['a', 'b', 'c', 'd'], styles: {} },
                startRow: 1,
                tableWidth: 4,
                startColumn: 0,
            });

            expect(cellMock.column).toHaveBeenCalledWith(0);
            expect(cellMock.column).toHaveBeenCalledWith(1);
            expect(cellMock.column).toHaveBeenCalledWith(2);
            expect(cellMock.column).toHaveBeenCalledWith(3);

            expect(cellMock.column(3).width).toBe(12);
        });

        it('usa headers = [] se undefined (?? [])', () => {
            spreadsheet.addTable({
                title: { value: 'no headers', styles: {} },
                body: { list: [], styles: {} },
                headers: undefined,
                startRow: 1,
                tableWidth: 2,
                startColumn: 0,
            });
            expect(cellMock.column).not.toHaveBeenCalled();
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

        it('deve chamar writeBuffer no workbook e retornar um Buffer', async () => {
            // Simula um ArrayBuffer fictício
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

});