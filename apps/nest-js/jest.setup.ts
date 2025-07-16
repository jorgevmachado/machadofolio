import { jest } from '@jest/globals';

import { Spreadsheet } from '@repo/services';

export const spreadsheetMock: jest.Mocked<Spreadsheet> = {
    loadFile: jest.fn(),
    addTable: jest.fn().mockImplementation(() => {
        return { nextRow: 1 };
    }),
    addTables: jest.fn().mockImplementation(() => {
        return { nextRow: 1 };
    }),
    workSheet: {
        cell: jest.fn(),
        addCell: jest.fn(),
    },
    createWorkSheet: jest.fn(),
    updateWorkSheet: jest.fn(),
    calculateTableHeight: jest.fn(({ total }) => total || 0),
    parseExcelRowsToObjectList: jest.fn(),
    calculateTablesParamsNextRow: jest.fn(({ startRow = 0, totalTables = 0, linesPerTable = 0 }) => (
        startRow + (totalTables * (linesPerTable + 1))
    )),
} as unknown as jest.Mocked<Spreadsheet>;

jest.mock('@repo/services', () => {
    const originalModule = jest.requireActual('@repo/services') as Record<string, any>;
    return {
        ...originalModule,
        isUUID: jest.fn(),
        Spreadsheet: jest.fn().mockImplementation(() => spreadsheetMock),
        filterByCommonKeys: jest.fn().mockImplementation((key, seeds) => seeds),
    }
});

beforeEach(() => {
    (Spreadsheet as unknown as jest.Mock).mockImplementation(() => spreadsheetMock);
});