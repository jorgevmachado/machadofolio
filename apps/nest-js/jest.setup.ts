import { jest } from '@jest/globals';

import { Spreadsheet, filterByCommonKeys } from '@repo/services';

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
        Spreadsheet: jest.fn(),
        filterByCommonKeys: jest.fn(),
    }
});

beforeEach(() => {
    (filterByCommonKeys as unknown as jest.Mock).mockImplementation((key, seeds) => seeds);
    (Spreadsheet as unknown as jest.Mock).mockImplementation(() => spreadsheetMock);
});

export const saveMock = jest.fn();
export const errorMock = jest.fn();
export const findOneMock = jest.fn();
export const findAllMock = jest.fn();

export const seederMock = {
    entities: jest.fn(),
    getRelation: jest.fn(),
    currentSeeds: jest.fn(),
}