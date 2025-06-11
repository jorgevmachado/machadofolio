import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

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
    };

    const mockTreatedTitle = {
        cell: mockDefaultTableParams.startRow,
        value: mockDefaultTableParams.title.value,
        merge: { positions: { startRow: mockDefaultTableParams.startRow, startColumn: mockDefaultTableParams.startColumn, endRow: mockDefaultTableParams.startRow, endColumn: mockDefaultTableParams.startColumn + mockDefaultTableParams.tableWidth - 1 } },
        styles: mockDefaultTableParams.title.styles,
        cellColumn: mockDefaultTableParams.startColumn,
    };

    const mockTreatedHeaders =  [
        {
            cell: 2,
            value: 'month',
            styles: mockDefaultTableParams.headers.styles,
            cellColumn: 1
        },
        {
            cell: 2,
            value: 'value',
            styles: mockDefaultTableParams.headers.styles,
            cellColumn: 2
        },
        {
            cell: 2,
            value: 'paid',
            styles: mockDefaultTableParams.headers.styles,
            cellColumn: 3
        }
    ];

    const mockTreatedBody = [
        {
            value: 'january',
            cell: 3,
            cellColumn: 1,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 100,
            cell: 3,
            cellColumn: 2,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'YES',
            cell: 3,
            cellColumn: 3,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'February',
            cell: 4,
            cellColumn: 1,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 200,
            cell: 4,
            cellColumn: 2,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'NO',
            cell: 4,
            cellColumn: 3,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'March',
            cell: 5,
            cellColumn: 1,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 300,
            cell: 5,
            cellColumn: 2,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'YES',
            cell: 5,
            cellColumn: 3,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'April',
            cell: 6,
            cellColumn: 1,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 400,
            cell: 6,
            cellColumn: 2,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'NO',
            cell: 6,
            cellColumn: 3,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'May',
            cell: 7,
            cellColumn: 1,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 500,
            cell: 7,
            cellColumn: 2,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'YES',
            cell: 7,
            cellColumn: 3,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'June',
            cell: 8,
            cellColumn: 1,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 600,
            cell: 8,
            cellColumn: 2,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'NO',
            cell: 8,
            cellColumn: 3,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'July',
            cell: 9,
            cellColumn: 1,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 700,
            cell: 9,
            cellColumn: 2,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'YES',
            cell: 9,
            cellColumn: 3,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'August',
            cell: 10,
            cellColumn: 1,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 800,
            cell: 10,
            cellColumn: 2,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'NO',
            cell: 10,
            cellColumn: 3,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'September',
            cell: 11,
            cellColumn: 1,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 900,
            cell: 11,
            cellColumn: 2,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'YES',
            cell: 11,
            cellColumn: 3,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'October',
            cell: 12,
            cellColumn: 1,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 1000,
            cell: 12,
            cellColumn: 2,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'NO',
            cell: 12,
            cellColumn: 3,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'November',
            cell: 13,
            cellColumn: 1,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 1100,
            cell: 13,
            cellColumn: 2,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'YES',
            cell: 13,
            cellColumn: 3,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'December',
            cell: 14,
            cellColumn: 1,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 1200,
            cell: 14,
            cellColumn: 2,
            styles: mockDefaultTableParams.body.styles
        },
        {
            value: 'NO',
            cell: 14,
            cellColumn: 3,
            styles: mockDefaultTableParams.body.styles
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    const createTableParams = (overrides?: Partial<TableParams>): TableParams => ({
        ...mockDefaultTableParams,
        ...overrides
    });

    describe('constructor', () => {
        it('Should create a table with default settings.', () => {
            const table = new Table(createTableParams());

            expect(table.title).toBeDefined();
            expect(table.headers).toHaveLength(3);
            expect(table.body).toHaveLength(36);
        });

        it('Should create a table without headers.', () => {
            const table = new Table(createTableParams({ headers: { list: [] } }));

            expect(table.headers).toHaveLength(0);
            expect(table.body).toHaveLength(0);
        });
    });

    describe('table title.', () => {
        it('Should create correct configuration for title.', () => {
            const table = new Table(createTableParams());

            expect(table.title).toEqual(mockTreatedTitle);
        });
    });

    describe('table header.', () => {
        it('Should create correct settings for the header.', () => {
            const table = new Table(createTableParams());
            expect(table.headers).toEqual(mockTreatedHeaders);
        });

        it('Should create correct settings for the header without title.', () => {
            const params =  createTableParams();
            const table = new Table({
                ...params,
                title: undefined
            });
            const expectedHeader = mockTreatedHeaders.map((item) => ({
                ...item,
                cell: 1
            }));
            expect(table.title).toBeUndefined();
            expect(table.headers).toEqual(expectedHeader);

        });
    });

    describe('table body.', () => {
        it('Should create correct settings for the body.', () => {
            const table = new Table(createTableParams());
            expect(table.body).toEqual(mockTreatedBody);
        });

        it('should fill with empty value when rawValue is absent.', () => {
            const params = {
                title: { value: 'Título', styles: {} },
                headers: { list: ['col1', 'col2'], styles: {} },
                body: {
                    list: [
                        { col1: 'Valor 1' }
                    ],
                    styles: {}
                },
                startRow: 0,
                tableWidth: 2,
                startColumn: 0
            };

            const table = new Table(params);
            
            const cellCol2 = table.body.find(cell => cell.cellColumn === 1);

            expect(cellCol2?.value).toBe('');
        });

    });
});