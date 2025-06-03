import { Table } from './table';
import type { TableParams } from './types';

describe('Table', () => {
    const mockData = [
        {
            month: 'january',
            value: 100,
            paid: true,
        },
        {
            month: 'February',
            value: 200,
            paid: false,
        },
        {
            month: 'March',
            value: 300,
            paid: true,
        },
        {
            month: 'April',
            value: 400,
            paid: false,
        },
        {
            month: 'May',
            value: 500,
            paid: true,
        },
        {
            month: 'June',
            value: 600,
            paid: false,
        },
        {
            month: 'July',
            value: 700,
            paid: true,
        },
        {
            month: 'August',
            value: 800,
            paid: false,
        },
        {
            month: 'September',
            value: 900,
            paid: true,
        },
        {
            month: 'October',
            value: 1000,
            paid: false,
        },
        {
            month: 'November',
            value: 1100,
            paid: true,
        },
        {
            month: 'December',
            value: 1200,
            paid: false,
        }
    ];
    const mockTable = { name: 'TABLE 1', data: mockData };
    const mockHeaders = ['month', 'value', 'paid'];

    const mockDefaultTableParams: TableParams = {
        body:  {
            list: mockTable.data,
            styles: {
                alignment: {
                    horizontal: 'center',
                    vertical: undefined,
                    wrapText: false,
                },
                borderStyle: 'thin',
            }
        },
        title: {
            value: mockTable.name,
            styles: {
                font: { bold: true },
                alignment: { wrapText: false },
                borderStyle: 'medium',
                fillColor: 'FFDDEE',
            }
        },
        headers: {
            list: mockHeaders,
            styles: {
                font: {
                    bold: true
                },
                alignment: {
                    horizontal: 'center',
                    vertical: undefined,
                    wrapText: false,
                },
                borderStyle: 'thin',
            }
        },
        startRow: 1,
        tableWidth: 3,
        startColumn: 1,
    }

    const createTableParams = (overrides?: Partial<TableParams>): TableParams => ({
        ...mockDefaultTableParams,
        ...overrides
    });

    describe('constructor', () => {
        it('deve criar uma tabela com configurações padrão', () => {
            const table = new Table(createTableParams());

            expect(table.title).toBeDefined();
            expect(table.headers).toHaveLength(3);
            expect(table.body).toHaveLength(4);
        });

        it('deve criar uma tabela sem título', () => {
            const table = new Table(createTableParams({ title: undefined }));

            expect(table.title.value).toBe('title');
        });

        it('deve criar uma tabela sem headers', () => {
            const table = new Table(createTableParams({ headers: { list: [] } }));

            expect(table.headers).toHaveLength(0);
            expect(table.body).toHaveLength(0);
        });
    });

    describe('título da tabela', () => {
        it('deve criar configuração correta para o título', () => {
            const table = new Table(createTableParams());

            expect(table.title).toEqual({
                cell: mockDefaultTableParams.startRow,
                value: mockDefaultTableParams.title.value,
                merge: { positions: { startRow: mockDefaultTableParams.startRow, startColumn: mockDefaultTableParams.startColumn, endRow: mockDefaultTableParams.startRow, endColumn: mockDefaultTableParams.startColumn + mockDefaultTableParams.tableWidth - 1 } },
                styles: mockDefaultTableParams.title.styles,
                cellColumn: mockDefaultTableParams.startColumn,
            });
        });
    });

    describe('cabeçalho da tabela', () => {
        it('deve criar configurações corretas para o cabeçalho', () => {
            const table = new Table(createTableParams());

            const expectedHeaders = mockDefaultTableParams.headers.list.map((header, index) => ({
                cell: mockDefaultTableParams.startRow + 1,
                value: header || '',
                styles: mockDefaultTableParams.headers.styles,
                cellColumn: mockDefaultTableParams.startColumn + index,
            }))

            expect(table.headers).toEqual(expectedHeaders);
        });
    });

    describe('corpo da tabela', () => {
        it('deve criar configurações corretas para o corpo', () => {
            const table = new Table(createTableParams());

            const expectedBody = [];

            expect(table.body).toEqual(expectedBody);
        });
    });
});