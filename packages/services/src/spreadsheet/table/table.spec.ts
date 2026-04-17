import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { ECellType } from '../worksheet';

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
        type: ECellType.SUBTITLE,
        value: mockDefaultTableParams.title.value,
        merge: {
            positions: {
                startRow: mockDefaultTableParams.startRow,
                startColumn: mockDefaultTableParams.startColumn,
                endRow: mockDefaultTableParams.startRow,
                endColumn: mockDefaultTableParams.startColumn + mockDefaultTableParams.tableWidth - 1
            }
        },
        styles: mockDefaultTableParams.title.styles,
        cellColumn: mockDefaultTableParams.startColumn,
    };

    const mockTreatedHeaders =  [
        {
            cell: 2,
            type: ECellType.HEADER,
            value: 'month',
            styles: mockDefaultTableParams.headers.styles,
            cellColumn: 1
        },
        {
            cell: 2,
            type: ECellType.HEADER,
            value: 'value',
            styles: mockDefaultTableParams.headers.styles,
            cellColumn: 2
        },
        {
            cell: 2,
            type: ECellType.HEADER,
            value: 'paid',
            styles: mockDefaultTableParams.headers.styles,
            cellColumn: 3
        }
    ];

    const mockTreatedBody = [
        {
            cell: 3,
            type: ECellType.BODY,
            value: 'january',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 1,
        },
        {
            cell: 3,
            type: ECellType.BODY,
            value: 100,
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 2,

        },
        {
            cell: 3,
            type: ECellType.BODY,
            value: 'YES',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 3,
        },
        {   cell: 4,
            type: ECellType.BODY,
            value: 'February',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 1,
        },
        {
            cell: 4,
            type: ECellType.BODY,
            value: 200,
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 2,
        },
        {
            cell: 4,
            type: ECellType.BODY,
            value: 'NO',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 3,
        },
        {
            cell: 5,
            type: ECellType.BODY,
            value: 'March',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 1,
        },
        {
            cell: 5,
            type: ECellType.BODY,
            value: 300,
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 2,
        },
        {
            cell: 5,
            type: ECellType.BODY,
            value: 'YES',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 3,
        },
        {
            cell: 6,
            type: ECellType.BODY,
            value: 'April',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 1,
        },
        {
            cell: 6,
            type: ECellType.BODY,
            value: 400,
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 2,
        },
        {
            cell: 6,
            type: ECellType.BODY,
            value: 'NO',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 3,
        },
        {
            cell: 7,
            type: ECellType.BODY,
            value: 'May',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 1,
        },
        {
            cell: 7,
            type: ECellType.BODY,
            value: 500,
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 2,
        },
        {
            cell: 7,
            type: ECellType.BODY,
            value: 'YES',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 3,
        },
        {
            cell: 8,
            type: ECellType.BODY,
            value: 'June',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 1,
        },
        {
            cell: 8,
            type: ECellType.BODY,
            value: 600,
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 2,
        },
        {
            cell: 8,
            type: ECellType.BODY,
            value: 'NO',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 3,
        },
        {
            cell: 9,
            type: ECellType.BODY,
            value: 'July',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 1,
        },
        {
            cell: 9,
            type: ECellType.BODY,
            value: 700,
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 2,
        },
        {
            cell: 9,
            type: ECellType.BODY,
            value: 'YES',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 3,
        },
        {
            cell: 10,
            type: ECellType.BODY,
            value: 'August',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 1,
        },
        {
            cell: 10,
            type: ECellType.BODY,
            value: 800,
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 2,
        },
        {
            cell: 10,
            type: ECellType.BODY,
            value: 'NO',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 3,
        },
        {
            cell: 11,
            type: ECellType.BODY,
            value: 'September',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 1,
        },
        {
            cell: 11,
            type: ECellType.BODY,
            value: 900,
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 2,
        },
        {
            cell: 11,
            type: ECellType.BODY,
            value: 'YES',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 3,
        },
        {
            cell: 12,
            type: ECellType.BODY,
            value: 'October',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 1,
        },
        {
            cell: 12,
            type: ECellType.BODY,
            value: 1000,
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 2,
        },
        {
            cell: 12,
            type: ECellType.BODY,
            value: 'NO',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 3,
        },
        {
            cell: 13,
            type: ECellType.BODY,
            value: 'November',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 1,
        },
        {
            cell: 13,
            type: ECellType.BODY,
            value: 1100,
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 2,
        },
        {
            cell: 13,
            type: ECellType.BODY,
            value: 'YES',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 3,
        },
        {
            cell: 14,
            type: ECellType.BODY,
            value: 'December',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 1,
        },
        {
            cell: 14,
            type: ECellType.BODY,
            value: 1200,
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 2,
        },
        {
            cell: 14,
            type: ECellType.BODY,
            value: 'NO',
            styles: mockDefaultTableParams.body.styles,
            cellColumn: 3,
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
            const table = new Table(createTableParams({ headers: { list: [], styles: {} } }));

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