import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../enum', () => ({
    EBillType: {
        PIX: 'PIX',
        BANK_SLIP: 'BANK_SLIP',
        CREDIT_CARD: 'CREDIT_CARD',
        ACCOUNT_DEBIT: 'ACCOUNT_DEBIT',
    }
}));

import {
    type CycleOfMonths,
    MONTHS,
    type TablesParams,
    totalByMonth,
    Spreadsheet,
    snakeCaseToNormal
} from '@repo/services';

import type { ExpenseEntity } from '../../../expense';
import { BILL_MOCK, EXPENSE_MONTH_MOCK, EXPENSE_PARENT_MOCK } from '../../../mock';

import { EBillType } from '../../enum';
import type Bill from '../../bill';

import BillSpreadsheetBusiness from './spreadsheet';

import { SpreadsheetProcessingParams } from './types';

jest.mock('@repo/services');

const allExpensesHaveBeenPaid = jest.fn(() => true);

const buildExpensesTablesParams: jest.MockedFunction<(expenses: Array<ExpenseEntity>, tableWidth: number) => TablesParams> = jest.fn();

describe('Bill Spreadsheet Business', () => {
    let business: BillSpreadsheetBusiness;
    let spreadsheetMock: jest.Mocked<Spreadsheet>;
    const mockDetailTables = [
        EBillType.BANK_SLIP,
        EBillType.ACCOUNT_DEBIT,
        EBillType.PIX,
        EBillType.CREDIT_CARD,
    ];

    const mockEntity: Bill = BILL_MOCK as unknown as Bill;
    const mockExpense: ExpenseEntity = EXPENSE_PARENT_MOCK as unknown as ExpenseEntity;
    const mockExpenses: Array<ExpenseEntity> = [mockExpense];
    const mockMonthEntity: ExpenseEntity['months'][number] = EXPENSE_MONTH_MOCK as unknown as ExpenseEntity['months'][number];
    const mockMonths: ExpenseEntity['months'] = MONTHS.map((month, index) => ({
        ...mockMonthEntity,
        code: index + 1,
        value: 100 * (index + 1),
        label: month,
    }));

    beforeEach(() => {
        spreadsheetMock = {
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
            calculateTableHeight: jest.fn(({ total }) => total || 0),
            calculateTablesParamsNextRow: jest.fn(({ startRow = 0, totalTables = 0, linesPerTable = 0 }) => (
                startRow + (totalTables * (linesPerTable + 1))
            )),
        } as unknown as jest.Mocked<Spreadsheet>;
        (Spreadsheet as unknown as jest.Mock).mockImplementation(() => spreadsheetMock);
        jest.clearAllMocks();
        jest.restoreAllMocks();
        business = new BillSpreadsheetBusiness();
        buildExpensesTablesParams.mockImplementation((expenses, tableWidth) => ({
            tables: expenses.map((expense) => ({
                title: expense.supplier.name,
                data: mockMonths.map((month) => ({
                    month: month.label.toUpperCase(),
                    value: month.value,
                    paid: month.paid
                }))
            })),
            headers: ['month', 'value', 'paid'],
            bodyStyle: {
                alignment: { horizontal: 'center', vertical: undefined, wrapText: false },
                borderStyle: 'thin'
            },
            tableWidth,
            titleStyle: {
                font: { bold: true },
                alignment: { wrapText: false },
                borderStyle: 'medium',
                fillColor: 'FFFFFF'
            },
            headerStyle: {
                font: { bold: true },
                alignment: { horizontal: 'center', vertical: undefined, wrapText: false },
                borderStyle: 'thin'
            },
            tableDataRows: 12,
        }));
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    describe('spreadsheetProcessing', () => {
        it('Shouldn\'t do anything because the data is empty.', () => {
            business.spreadsheetProcessing({
                year: 2025,
                sheet: spreadsheetMock,
                data: [],
                summary: false,
                groupName: 'groupName',
                allExpensesHaveBeenPaid,
                buildExpensesTablesParams
            });

            expect(spreadsheetMock.addTable).not.toHaveBeenCalled();
            expect(spreadsheetMock.addTables).not.toHaveBeenCalled();
        });

        it('Processes normally with basic bills.', () => {
            const params: SpreadsheetProcessingParams = {
                year: 2025,
                sheet: spreadsheetMock,
                data: [{ ...mockEntity, type: EBillType.BANK_SLIP, expenses: mockExpenses }],
                startRow: 0,
                groupName: 'groupName',
                tableWidth: 0,
                tableHeader: undefined,
                startColumn: 0,
                detailTables: mockDetailTables,
                buildExpensesTablesParams,
                allExpensesHaveBeenPaid,

            };
            business.spreadsheetProcessing(params);
            expect(spreadsheetMock.createWorkSheet).toHaveBeenCalled();
            expect(spreadsheetMock.addTable).toHaveBeenCalled();
            expect(spreadsheetMock.addTables).toHaveBeenCalled();

        });

        it('Covers flow with childrenTables.', () => {
            const params: SpreadsheetProcessingParams = {
                year: 2025,
                sheet: spreadsheetMock,
                data: [
                    { ...mockEntity, type: EBillType.BANK_SLIP, expenses: mockExpenses },
                    { ...mockEntity, type: EBillType.BANK_SLIP, expenses: undefined },
                    { ...mockEntity, expenses: mockExpenses },
                    { ...mockEntity, expenses: [{ ...mockExpense, children: undefined }] },
                    { ...mockEntity },
                ],
                startRow: 0,
                groupName: 'groupName',
                tableWidth: 0,
                tableHeader: undefined,
                startColumn: 0,
                detailTables: mockDetailTables,
                allExpensesHaveBeenPaid,
                buildExpensesTablesParams,

            };
            business.spreadsheetProcessing(params);
            expect(spreadsheetMock.addTable).toHaveBeenCalled();
            expect(spreadsheetMock.addTables).toHaveBeenCalled();
        });
    });

    describe('getWorkSheetTitle', () => {
        it('must correctly extract the year and title name in the format "Name (2025)".', () => {
            spreadsheetMock.workSheet.cell.mockImplementation(() => ({ value: 'Fixed Accounts (2025)' }) as any);
            const result = business.getWorkSheetTitle({
                row: 2,
                column: 1,
                workSheet: spreadsheetMock.workSheet
            });
            expect(result).toMatchObject({
                year: 2025,
                groupName: 'Fixed Accounts',
                nextRow: 10 + 1 + 2 + 1,
            });
        });

        it('should return the current year and name when there is no year in the title.', () => {
            const currentYear = new Date().getFullYear();
            spreadsheetMock.workSheet.cell.mockImplementation(() => ({ value: 'Other releases' }) as any);
            const result = business.getWorkSheetTitle({
                row: 1,
                column: 1,
                workSheet: spreadsheetMock.workSheet
            });
            expect(result.year).toBe(currentYear);
            expect(result.groupName).toBe('Other releases');

        });

        it('must handle undefined value in cell.', () => {
            const currentYear = new Date().getFullYear();
            spreadsheetMock.workSheet.cell.mockImplementation(() => ({ value: undefined }) as any);
            const result = business.getWorkSheetTitle({
                row: 1,
                column: 1,
                workSheet: spreadsheetMock.workSheet
            });
            expect(result.year).toBe(currentYear);
            expect(result.groupName).toBe('');
        });

        it('must use custom parameters correctly.', () => {
            spreadsheetMock.workSheet.cell.mockImplementation(() => ({ value: 'Custom (2030)' }) as any);
            const result = business.getWorkSheetTitle({
                row: 5,
                merge: 8,
                column: 2,
                topSpace: 2,
                workSheet: spreadsheetMock.workSheet,
                bottomSpace: 1
            });
            expect(result).toMatchObject({
                year: 2030,
                groupName: 'Custom',
                nextRow: 8 + 2 + 1 + 1
            });
        });

        it('must treat extra spaces in the value.', () => {
            spreadsheetMock.workSheet.cell.mockImplementation(() => ({ value: '   Investments   (2022)   ' }) as any);
            const result = business.getWorkSheetTitle({
                row: 3,
                column: 1,
                workSheet: spreadsheetMock.workSheet
            });
            expect(result).toMatchObject({
                year: 2022,
                groupName: 'Investments',
            });
        });

        it('should return the cell text directly when there is no match in the regex (null match).', () => {
            const CELL_VALUE = 'Purchasing Group';

            const year = new Date().getFullYear();
            spreadsheetMock.workSheet.cell.mockImplementation(() => ({ value: CELL_VALUE }) as any);

            jest.spyOn(String.prototype, 'match').mockImplementation(() => ['Purchasing Group', undefined, `${year}`]);

            const result = business.getWorkSheetTitle({
                    row: 1,
                    column: 2,
                    workSheet: spreadsheetMock.workSheet,
                }
            );

            expect(result).toEqual({
                year: year,
                nextRow: 10 + 1 + 2 + 1,
                groupName: CELL_VALUE,
            });
        });

    });

    describe('privates', () => {
        const mockData = [
            { ...mockEntity, type: EBillType.BANK_SLIP, expenses: mockExpenses },
            { ...mockEntity, type: EBillType.BANK_SLIP, expenses: undefined },
            { ...mockEntity, expenses: mockExpenses },
            { ...mockEntity, expenses: [{ ...mockExpense, children: undefined }] },
            { ...mockEntity },
        ];

        const mockTableData = mockData.map((item) => ({
            type: snakeCaseToNormal(item.type),
            bank: item.bank.name,
            list: item.expenses ?? []
        }));

        describe('processingSpreadsheetTable', () => {

            it('should return startRow when not have table', () => {
                const result = business['processingSpreadsheetTable']({
                    sheet: spreadsheetMock,
                    table: undefined,
                    startRow: 14,
                    startColumn: 2,
                    buildBodyDataMap: (data) => ({
                        data: data.list,
                        bank: data.bank,
                        type: data.type,
                        arrFunction: allExpensesHaveBeenPaid
                    })
                });

                expect(result).toBe(14);
            });

            it('should return startRow when not have tableBodyData', () => {
                const result = business['processingSpreadsheetTable']({
                    sheet: spreadsheetMock,
                    table: {
                        data: [],
                        header: []
                    },
                    startRow: 14,
                    startColumn: 2,
                    buildBodyDataMap: (data) => ({
                        data: data.list,
                        bank: data.bank,
                        type: data.type,
                        arrFunction: allExpensesHaveBeenPaid
                    })
                });

                expect(result).toBe(14);
            });

            it('should return a new start row when table title is defined', () => {
                const result = business['processingSpreadsheetTable']({
                    sheet: spreadsheetMock,
                    table: {
                        data: mockTableData,
                        title: 'Summary',
                        footer: true,
                        header: ['title', 'bank', ...MONTHS, 'paid', 'total']
                    },
                    startRow: 14,
                    startColumn: 2,
                    buildBodyDataMap: (data) => ({
                        data: data.list,
                        bank: data.bank,
                        type: data.type,
                        arrFunction: allExpensesHaveBeenPaid
                    }),
                    buildFooterData: (data) => {
                        const monthsObj = MONTHS.reduce((acc, month) => {
                            acc[month] = totalByMonth(month, data);
                            return acc;
                        }, {} as CycleOfMonths);
                        return {
                            paid: data.every(item => item && item.paid),
                            footer: true,
                            type: 'TOTAL',
                            ...monthsObj,
                            total: data.reduce((sum, item) => sum + (Number(item.total) || 0), 0),
                        };
                    }
                });

                expect(result).toBe(2);
            });

            it('should return a new start row when table title is undefined', () => {

                const tableData = mockData.map((item) => ({
                    type: snakeCaseToNormal(item.type),
                    bank: item.bank.name,
                    list: item.expenses ?? []
                }));

                const result = business['processingSpreadsheetTable']({
                    sheet: spreadsheetMock,
                    table: {
                        data: tableData,
                        title: undefined,
                        footer: false,
                        header: ['title', 'bank', ...MONTHS, 'paid', 'total']
                    },
                    startRow: 14,
                    startColumn: 2,
                    buildBodyDataMap: (data) => ({
                        data: data.list,
                        bank: data.bank,
                        type: data.type,
                        arrFunction: allExpensesHaveBeenPaid
                    }),
                });

                expect(result).toBe(2);
            });
        });

        describe('processingSpreadsheetSecondaryTables', () => {
            it('Should processingSpreadsheetSecondaryTables with type other than  CREDIT_CARD.', () => {
                const result = business['processingSpreadsheetSecondaryTables']({
                    sheet: spreadsheetMock,
                    data: [{ ...mockEntity, type: EBillType.BANK_SLIP, expenses: mockExpenses }],
                    buildExpensesTablesParams,
                    allExpensesHaveBeenPaid,
                    startRow: 14,
                    startColumn: 2,
                    tableWidth: 3,
                    detailTablesHeader: ['month', 'value', 'paid'],
                    groupsName: [],
                    tableHeader: ['title', ...MONTHS, 'paid', 'total'],
                    detailTables: mockDetailTables
                });

                expect(result).toBe(2);
            });

            it('Should processingSpreadsheetSecondaryTables with type other than CREDIT_CARD and expenses empty.', () => {
                const result = business['processingSpreadsheetSecondaryTables']({
                    sheet: spreadsheetMock,
                    data: [{ ...mockEntity, type: EBillType.BANK_SLIP, expenses: undefined }],
                    buildExpensesTablesParams,
                    allExpensesHaveBeenPaid,
                    startRow: 14,
                    startColumn: 2,
                    tableWidth: 3,
                    detailTablesHeader: ['month', 'value', 'paid'],
                    groupsName: [],
                    tableHeader: ['title', ...MONTHS, 'paid', 'total'],
                    detailTables: mockDetailTables
                });

                expect(result).toBe(14);
            });

            it('Should processingSpreadsheetSecondaryTables with type CREDIT_CARD.', () => {
                const result = business['processingSpreadsheetSecondaryTables']({
                    sheet: spreadsheetMock,
                    data: [{ ...mockEntity, type: EBillType.CREDIT_CARD, expenses: mockExpenses }],
                    buildExpensesTablesParams,
                    allExpensesHaveBeenPaid,
                    startRow: 14,
                    startColumn: 2,
                    tableWidth: 3,
                    detailTablesHeader: ['month', 'value', 'paid'],
                    groupsName: [],
                    tableHeader: ['title', ...MONTHS, 'paid', 'total'],
                    detailTables: mockDetailTables
                });

                expect(result).toBe(2);
            });

            it('Should processingSpreadsheetSecondaryTables with type CREDIT_CARD and expenses empty.', () => {
                const result = business['processingSpreadsheetSecondaryTables']({
                    sheet: spreadsheetMock,
                    data: [{ ...mockEntity, type: EBillType.CREDIT_CARD, expenses: undefined }],
                    buildExpensesTablesParams,
                    allExpensesHaveBeenPaid,
                    startRow: 14,
                    startColumn: 2,
                    tableWidth: 3,
                    detailTablesHeader: ['month', 'value', 'paid'],
                    groupsName: [],
                    tableHeader: ['title', ...MONTHS, 'paid', 'total'],
                    detailTables: mockDetailTables
                });

                expect(result).toBe(14);
            });

            it('Should processingSpreadsheetSecondaryTables with type CREDIT_CARD and all total undefined.', () => {
                const monthsObj = MONTHS.reduce((acc, month) => {
                    acc[month] = 50;
                    return acc;
                }, {} as CycleOfMonths);
                const buildBodyDataSpy = jest.spyOn(business as any, 'buildBodyData').mockImplementation(() => ({
                    paid: false,
                    ...monthsObj,
                    total: undefined
                }));
                const result = business['processingSpreadsheetSecondaryTables']({
                    sheet: spreadsheetMock,
                    data: [{
                        ...mockEntity,
                        type: EBillType.CREDIT_CARD,
                        expenses: [{ ...mockExpense, children: undefined }]
                    }],
                    buildExpensesTablesParams,
                    allExpensesHaveBeenPaid,
                    startRow: 14,
                    startColumn: 2,
                    tableWidth: 3,
                    detailTablesHeader: ['month', 'value', 'paid'],
                    groupsName: [],
                    tableHeader: ['title', ...MONTHS, 'paid', 'total'],
                    detailTables: mockDetailTables
                });

                expect(result).toBe(2);
                expect(buildBodyDataSpy).toHaveBeenCalled();

                buildBodyDataSpy.mockRestore();
            });
        });

        describe('processingSpreadsheetDetailTable', () => {
            it('should return startRow when not have table', () => {
                const result = business['processingSpreadsheetDetailTable']({
                    sheet: spreadsheetMock,
                    table: undefined,
                    startRow: 14,
                    tableWidth: 3,
                    detailTablesHeader: ['month', 'value', 'paid'],
                    buildExpensesTablesParams
                });

                expect(result).toBe(14);
            });

            it('should return startRow when table title is undefined.', () => {
                const result = business['processingSpreadsheetDetailTable']({
                    sheet: spreadsheetMock,
                    table: {
                        title: undefined,
                        data: mockTableData,
                        header: ['title', 'bank', ...MONTHS, 'paid', 'total']
                    },
                    startRow: 14,
                    tableWidth: 3,
                    detailTablesHeader: ['month', 'value', 'paid'],
                    buildExpensesTablesParams
                });

                expect(result).toBe(2);
            });
        });
    });
});