import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import * as stringUtils from '@repo/services/string/string';
import { type CycleOfMonths, MONTHS, totalByMonth } from '@repo/services/date/month/month';
import { Spreadsheet } from '@repo/services/spreadsheet/spreadsheet';
import type { TablesParams } from '@repo/services/spreadsheet/table/types';
import { snakeCaseToNormal } from '@repo/services/string/string';

import { EXPENSE_PARENT_MOCK } from '../../expense';
import type Expense from '../../expense';

import { BILL_MOCK } from '../mock';
import type Bill from '../bill';
import { EBillType } from '../enum';
import type { SpreadsheetProcessingParams } from './types';

import BillBusiness from './business';

jest.mock('@repo/services/spreadsheet/spreadsheet');

const buildExpensesTablesParams: jest.MockedFunction<(expenses: Array<Expense>, tableWidth: number) => TablesParams> = jest.fn();

const allExpensesHaveBeenPaid = jest.fn(() => true);

describe('Bill Business', () => {
    let business: BillBusiness;
    let spreadsheetMock: jest.Mocked<Spreadsheet>;
    const mockDetailTables = [
        EBillType.BANK_SLIP,
        EBillType.ACCOUNT_DEBIT,
        EBillType.PIX,
        EBillType.CREDIT_CARD,
    ];

    const mockEntity: Bill = BILL_MOCK;
    const mockExpense: Expense = EXPENSE_PARENT_MOCK;
    const mockExpenses: Array<Expense> = [mockExpense];
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
        business = new BillBusiness();

        buildExpensesTablesParams.mockImplementation((expenses, tableWidth) => ({
            tables: expenses.map((expense) => ({
                title: expense.supplier.name,
                data: [
                    { month: 'JANUARY', value: expense.january, paid: expense.january_paid },
                    { month: 'FEBRUARY', value: expense.february, paid: expense.february_paid },
                    { month: 'MARCH', value: expense.march, paid: expense.march_paid },
                    { month: 'APRIL', value: expense.april, paid: expense.april_paid },
                    { month: 'MAY', value: expense.may, paid: expense.may_paid },
                    { month: 'JUNE', value: expense.june, paid: expense.june_paid },
                    { month: 'JULY', value: expense.july, paid: expense.july_paid },
                    { month: 'AUGUST', value: expense.august, paid: expense.august_paid },
                    { month: 'SEPTEMBER', value: expense.september, paid: expense.september_paid },
                    { month: 'OCTOBER', value: expense.october, paid: expense.october_paid },
                    { month: 'NOVEMBER', value: expense.november, paid: expense.november_paid },
                    { month: 'DECEMBER', value: expense.december, paid: expense.december_paid },
                ]
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
    });

    describe('calculate', () => {
        it('should calculate bill without expenses', () => {
            const result = business.calculate(mockEntity);
            expect(result.total).toBe(0);
            expect(result.total_paid).toBe(0);
            expect(result.all_paid).toBeFalsy();
        });

        it('should calculate bill with expenses', () => {
            const result = business.calculate({ ...mockEntity, expenses: mockExpenses });
            expect(result.total).toBe(100);
            expect(result.total_paid).toBe(0);
            expect(result.all_paid).toBeFalsy();
        });

        it('Should calculate even when expense[property] is undefined.', () => {
            const bill = {
                expenses: [
                    { total: undefined, total_paid: undefined, paid: true }
                ]
            } as any;

            const sumSpy = jest.spyOn(business as any, 'sumTotalExpenses');

            const result = business.calculate(bill);

            expect(sumSpy).toHaveBeenCalledWith(bill.expenses, 'total');
            expect(sumSpy).toHaveBeenCalledWith(bill.expenses, 'total_paid');

            expect(result.total).toBe(0);
            expect(result.total_paid).toBe(0);

            expect(result.all_paid).toBe(true);

            sumSpy.mockRestore();
        });

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
            const currentYear =  new Date().getFullYear();
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

        it('deve retornar o texto da célula diretamente quando não houver correspondência no regex (match nulo)', () => {
            const CELL_VALUE = 'Purchasing Group';

            spreadsheetMock.workSheet.cell.mockImplementation(() => ({ value: CELL_VALUE }) as any);

            jest.spyOn(String.prototype, 'match').mockImplementation((regex) => ['Purchasing Group', undefined, '2025']);

            const result = business.getWorkSheetTitle({
                row: 1,
                column: 2,
                workSheet: spreadsheetMock.workSheet,
                }
            );

            const year = new Date().getFullYear();

            expect(result).toEqual({
                year: year,
                nextRow: 10 + 1 + 2 + 1,
                groupName: CELL_VALUE,
            });
        });

    });

    describe('generateDetailsTable', () => {
        it('should return acc and nextRow when cell value is empty.', () => {
            spreadsheetMock.workSheet.cell.mockReturnValueOnce(undefined as any);
            const result = business.generateDetailsTable({
                bills: [mockEntity],
                startRow: 10,
                workSheet: spreadsheetMock.workSheet
            });

            expect(result.data).toEqual([]);
            expect(result.nextRow).toBe(10);
        });

        it('should return acc and nextRow when type does not exist in bills.', () => {
            spreadsheetMock.workSheet.cell.mockReturnValueOnce({ value: 'UNKNOWN_TYPE' } as any);

            const result = business.generateDetailsTable({
                bills: [mockEntity],
                startRow: 5,
                workSheet: spreadsheetMock.workSheet
            });

            expect(result.data).toEqual([]);
            expect(result.nextRow).toBe(5);
        });

        it('should recurse and accumulate correctly when the type exists and accumulateGroupTables is called.', () => {
            const billTypeBankSlipMock = { ...mockEntity, type: EBillType.BANK_SLIP };
            let call = 0;

            spreadsheetMock.workSheet.cell.mockImplementation((row, col) => {
                call++;
                if (call === 1) {
                    return { value: EBillType.BANK_SLIP } as any;
                }
                return { value: '' } as any;
            });
            
            const accReturn = ['some accumulated'] as any;

            const spy = jest
                .spyOn(business as any, 'accumulateGroupTables')
                .mockReturnValue({ acc: accReturn, lastRow: 20 });
            

            const result = business.generateDetailsTable({
                bills: [billTypeBankSlipMock],
                startRow: 7,
                workSheet: spreadsheetMock.workSheet
            });

            expect(spy).toHaveBeenCalledWith({
                acc: [],
                bill: billTypeBankSlipMock,
                startRow: 8,
                workSheet: spreadsheetMock.workSheet
            });
            expect(spreadsheetMock.workSheet.cell).toHaveBeenCalledTimes(2);
            expect(result.data).toBe(accReturn);
            expect(result.nextRow).toBe(20);
        });

        it('must handle multiple recursive calls if applicable.', () => {
            const billTypeBankSlipMock = { ...mockEntity, type: EBillType.BANK_SLIP };
            const billTypeAccountDebitMock = { ...mockEntity, type: EBillType.ACCOUNT_DEBIT };

            const types = [
                EBillType.BANK_SLIP,
                EBillType.ACCOUNT_DEBIT,
                EBillType.BANK_SLIP,
                ''
            ];

            let idx = 0;
            spreadsheetMock.workSheet.cell.mockImplementation((row, col) => ({
                value: types[idx++]
            }) as any);


            const bills = [billTypeBankSlipMock, billTypeAccountDebitMock];

            const business = new BillBusiness();
            const accumulateSpy = jest.spyOn(business as any, 'accumulateGroupTables')
                .mockImplementation(({ acc }) => {
                    if (acc.length === 0) {
                        return { acc: ['A'], lastRow: 11 };
                    }
                    if (acc.length === 1) {
                        return { acc: ['A', 'B'], lastRow: 21 };
                    }
                    return { acc: ['A', 'B', 'C'], lastRow: 31 };
                });

            const result = business.generateDetailsTable({
                bills,
                startRow: 1,
                workSheet: spreadsheetMock.workSheet
            });

            expect(accumulateSpy).toHaveBeenCalledTimes(3);
            expect(spreadsheetMock.workSheet.cell).toHaveBeenCalledTimes(4);
            expect(result.data).toEqual(['A', 'B', 'C']);
            expect(result.nextRow).toBe(31);
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
                    data: [{ ...mockEntity, type: EBillType.CREDIT_CARD, expenses: [{ ...mockExpense, children: undefined }] }],
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

        describe('buildDetailData', () => {
            it('should return undefined if the title value is empty.', () => {
                const result = business['buildDetailData']({
                    row: 5,
                    bill: mockEntity,
                    cell: { value: undefined } as any,
                    column: 2,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(result).toBeUndefined();
            });

            it('should return undefined if cell.value is empty string.', () => {
                const result = business['buildDetailData']({
                    row: 5,
                    bill: mockEntity,
                    cell: { value: '     ' } as any,
                    column: 2,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(result).toBeUndefined();
            });

            it('should return the correctly populated BuildDetailData object.', () => {
                const rowsBase = 9;
                const mockValues = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
                const mockPaid = ['YES', 'NO', 'YES', 'NO', 'YES', 'NO', 'YES', 'YES', 'NO', 'NO', 'YES', 'NO'];

                spreadsheetMock.workSheet.cell.mockImplementation((row, column) => {
                    const index = Number(row) - rowsBase;
                    if (column === 5 && index >= 0 && index < 12) {
                        return { value: mockValues[index] } as any;
                    }
                    if (column === 6 && index >= 0 && index < 12) {
                        return { value: mockPaid[index] } as any;
                    }
                    return { value: undefined } as any;
                });

                const result = business['buildDetailData']({
                    row: rowsBase,
                    cell: { value: ' SupplierX ' } as any,
                    bill: mockEntity,
                    column: 5,
                    workSheet: spreadsheetMock.workSheet,
                });

                expect(result).toBeDefined();
                expect(result?.supplier).toBe('SupplierX');
                expect(result?.bill).toBe(mockEntity);
                MONTHS.forEach((m, i) => {
                    expect(result?.[m]).toBe(mockValues[i]);
                    expect(result?.[`${m}_paid`]).toBe(mockPaid[i] === 'YES');
                });
            });

            it('must use value 0 and paid NO when cells return empty/undefined.', () => {
                spreadsheetMock.workSheet.cell.mockImplementation(() => ({ value: undefined }) as any);
                const result = business['buildDetailData']({
                    row: 100,
                    cell: { value: 'SupplierEmpty' } as any,
                    bill: mockEntity,
                    column: 10,
                    workSheet: spreadsheetMock.workSheet,
                });
                expect(result).toBeDefined();
                expect(result?.supplier).toBe('SupplierEmpty');
                expect(result?.bill).toBe(mockEntity);

                for(const month of MONTHS) {
                    expect(result?.[month]).toBe(0);
                    expect(result?.[`${month}_paid`]).toBe(false);
                }
            });

            it('must trim the title correctly.', () => {
                spreadsheetMock.workSheet.cell.mockImplementation((row, column) => {
                    if(Number(column) % 2 === 0) {
                        return { value: 7 } as any;
                    }
                    return { value: 'YES' } as any;
                });

                const result = business['buildDetailData']({
                    row: 0,
                    cell: { value: '   MySupplier   ' } as any,
                    bill: mockEntity,
                    column: 2,
                    workSheet: spreadsheetMock.workSheet,
                });
                expect(result).toBeDefined();
                expect(result?.supplier).toBe('MySupplier');
            });
        });

        describe('buildGroupTable', () => {
            it('should return correct object when cell is merged (_mergeCount === 2).', () => {

                const buildDetailDataMock = jest.spyOn(business, 'buildDetailData' as any)
                    .mockImplementation(({ column }) => ({ column, key: `mock${column}` }));

                spreadsheetMock.workSheet.cell
                    .mockReturnValueOnce({ isMerged: true, _mergeCount: 2 } as any)
                    .mockReturnValueOnce({} as any)
                    .mockReturnValueOnce({} as any);

                const result = business['buildGroupTable']({
                    row: 10,
                    bill: mockEntity,
                    workSheet: spreadsheetMock.workSheet,
                });

                expect(spreadsheetMock.workSheet.cell).toHaveBeenNthCalledWith(1, 10, 3);
                expect(spreadsheetMock.workSheet.cell).toHaveBeenNthCalledWith(2, 10, 8);
                expect(spreadsheetMock.workSheet.cell).toHaveBeenNthCalledWith(3, 10, 13);

                expect(buildDetailDataMock).toHaveBeenCalledTimes(3);
                expect(result.data).toHaveLength(3);
                expect(result.data[0]).toEqual(expect.objectContaining({ column: 4 }));
                expect(result.data[1]).toEqual(expect.objectContaining({ column: 9 }));
                expect(result.data[2]).toEqual(expect.objectContaining({ column: 14 }));
                expect(result.nextRow).toBe(25);
                expect(result.hasNext).toBe(true);
            });

            it('should skip null/undefined data from buildDetailData.', () => {
                jest.spyOn(business, 'buildDetailData' as any)
                    .mockReturnValueOnce(null)
                    .mockReturnValueOnce(undefined)
                    .mockReturnValueOnce({ chave: 'ok', column: 14 });

                spreadsheetMock.workSheet.cell
                    .mockReturnValueOnce({ isMerged: true, _mergeCount: 2 } as any)
                    .mockReturnValueOnce({} as any)
                    .mockReturnValueOnce({} as any);

                const result = business['buildGroupTable']({
                    row: 15,
                    bill: mockEntity,
                    workSheet: spreadsheetMock.workSheet,
                });

                expect(result.data).toHaveLength(1);
                expect(result.data[0]).toEqual(expect.objectContaining({ column: 14 }));
                expect(result.hasNext).toBe(true);
            });

            it('should return empty data, nextRow equal to row and hasNext false if cell is not merged or mergeCount !== 2.', () => {
                spreadsheetMock.workSheet.cell.mockReturnValue({ isMerged: false, _mergeCount: 2 } as any);

                let result = business['buildGroupTable']({
                    row: 2,
                    bill: mockEntity,
                    workSheet: spreadsheetMock.workSheet,
                });
                expect(result).toEqual({ data: [], nextRow: 2, hasNext: false });

                spreadsheetMock.workSheet.cell.mockReturnValue({ isMerged: true, _mergeCount: 3 } as any);

                result = business['buildGroupTable']({
                    row: 5,
                    bill: mockEntity,
                    workSheet: spreadsheetMock.workSheet,
                });
                expect(result).toEqual({ data: [], nextRow: 5, hasNext: false });
            });
        });

        describe('accumulateGroupTables', () => {
            it('should accumulate data when hasNext is false (no recursion).', () => {
                const acc = [{ name: 'item1' }];
                const startRow = 5;

                const buildGroupTableMock = jest.spyOn(business as any, 'buildGroupTable').mockImplementation(() => ({
                    data: [{ name: 'item2' }, { name: 'item3' }],
                    nextRow: 10,
                    hasNext: false
                }));

                const result = business['accumulateGroupTables']({
                    acc,
                    bill: mockEntity,
                    startRow,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(buildGroupTableMock).toHaveBeenCalledWith({
                    row: startRow,
                    bill: mockEntity,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(result.acc).toEqual([
                    { name: 'item1' },
                    { name: 'item2' },
                    { name: 'item3' }
                ]);
                expect(result.lastRow).toBe(10);
                expect(buildGroupTableMock).toHaveBeenCalledTimes(1);
            });

            it('must accumulate data across multiple recursions when hasNext is true.', () => {
                const acc = [];
                const startRow = 1;

                const buildGroupTableMock = jest
                    .spyOn(business as any, 'buildGroupTable')
                    .mockImplementationOnce((params) => ({
                        data: [{ sequence: 1 }],
                        nextRow: 2,
                        hasNext: true
                    }))
                    .mockImplementationOnce((params) => ({
                        data: [{ sequence: 2 }],
                        nextRow: 3,
                        hasNext: true
                    }))
                    .mockImplementationOnce((params) => ({
                        data: [{ sequence: 3 }],
                        nextRow: 4,
                        hasNext: false
                    }));

                const result = business['accumulateGroupTables']({
                    acc,
                    bill: mockEntity,
                    startRow,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(buildGroupTableMock).toHaveBeenCalledTimes(3);
                expect(result.acc).toEqual([
                    { sequence: 1 },
                    { sequence: 2 },
                    { sequence: 3 }
                ]);
                expect(result.lastRow).toBe(4);
            });

            it('should return the accumulated amounts correctly even if the data is empty.', () => {
                const acc: any[] = [];
                const startRow = 2;

                const buildGroupTableMock = jest.spyOn(business as any, 'buildGroupTable').mockImplementation(() => ({
                    data: [],
                    nextRow: 7,
                    hasNext: false
                }));

                const result = business['accumulateGroupTables']({
                    acc,
                    bill: mockEntity,
                    startRow,
                    workSheet: spreadsheetMock.workSheet,
                });

                expect(result.acc).toEqual([]);
                expect(result.lastRow).toBe(7);
                expect(buildGroupTableMock).toHaveBeenCalledTimes(1);
            });

            it('must correctly pass accumulated data between recursions.', () => {
                const acc = [{ existing: true }];
                const startRow = 5;

                const buildGroupTableMock = jest
                    .spyOn(business as any, 'buildGroupTable')
                    .mockImplementationOnce(() => ({
                        data: [{ d: 1 }],
                        nextRow: 6,
                        hasNext: true
                    }))
                    .mockImplementationOnce(() => ({
                        data: [{ d: 2 }],
                        nextRow: 7,
                        hasNext: false
                    }));

                const result = business['accumulateGroupTables']({
                    acc,
                    bill: mockEntity,
                    startRow,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result.acc).toEqual([
                    { existing: true },
                    { d: 1 },
                    { d: 2 }
                ]);
                expect(result.lastRow).toBe(7);
                expect(buildGroupTableMock).toHaveBeenCalledTimes(2);
                expect(buildGroupTableMock).toHaveBeenNthCalledWith(1, {
                    row: 5,
                    bill: mockEntity,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(buildGroupTableMock).toHaveBeenNthCalledWith(2, {
                    row: 6,
                    bill: mockEntity,
                    workSheet: spreadsheetMock.workSheet
                });
            });
        });
        
        describe('buildCreditCardBodyData', () => {
            function buildMockWorksheet(cells: Array<any>) {
                let call = 0;
                spreadsheetMock.workSheet.cell.mockImplementation((row, col) => {
                    call++;
                    return { value: cells[call - 1] } as any;
                });
            }

            it('should correctly generate the object for the default case (isParent = true).', () => {
                const cells = [
                    'Credit Card Nubank Physical',
                    '100',
                    '200',
                    '300', 
                    '400',
                    '500', 
                    '600', 
                    '700', 
                    '800', 
                    '900', 
                    '1000', 
                    '1100', 
                    '1200',
                    'YES',
                    '7800'
                ];
               buildMockWorksheet(cells);

                const result = business.buildCreditCardBodyData({
                    row: 1,
                    bill: mockEntity,
                    column: 1,
                    isParent: true,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: [],
                });

                expect(result.data.name).toBe('Personal Credit Card Nubank Physical');

                MONTHS.forEach((month, i) => {
                    expect(result.data[month]).toBe(Number(cells[i + 1]));
                    expect(result.data[`${month}_paid`]).toBe(true);
                });

                expect(result.data.year).toBe(mockEntity.year);
                expect(result.data.bill).toBe(mockEntity);
                expect(result.data.supplier).toBe('Physical');
                expect(result.data.is_aggregate).toBe(false);
                expect(result.data.paid).toBe(true);
                expect(result.data.total).toBe(7800);
                expect(result.supplierList).toEqual(['Physical']);
                expect(result.data.aggregate_name).toBe('');
            });

            it('should generate correctly with isParent = false and supplierList populated.', () => {
                const supplierList = ['Ifood', 'Physical'];
                const cells = [
                    'Credit Card Nubank Physical Apache', '1','2','3','4','5','6','7','8','9','10','11','12','NO','66'
                ];

                buildMockWorksheet(cells);

                const result = business.buildCreditCardBodyData({
                    row: 1,
                    column: 1,
                    bill: mockEntity,
                    isParent: false,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList,
                });

                expect(result.data.name).toBe('Personal Credit Card Nubank Physical Apache');
                MONTHS.forEach((month, i) => {
                    expect(result.data[month]).toBe(Number(cells[i + 1]));
                    expect(result.data[`${month}_paid`]).toBe(false);
                });
                expect(result.data.is_aggregate).toBe(true);
                expect(result.data.paid).toBe(false);
                expect(result.data.supplier).toBe('Apache');
                expect(result.data.aggregate_name).toBe('Physical');
                expect(result.supplierList).toEqual([]);
            });

            it('must handle missing values (empty or non-numeric cells).', () => {
                const cells = [
                    '', 'A', null, undefined, '', '1', '2', '3', '4', '5', null, '', // meses
                    '', '',
                ];

                buildMockWorksheet(cells);

                const result = business.buildCreditCardBodyData({
                    row: 1,
                    bill: mockEntity,
                    column: 1,
                    isParent: true,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: undefined,
                });

                MONTHS.forEach((month, i) => {
                    const cell = cells?.[i+1];
                    const cellNumber =  Number(cell);
                    if(Number.isNaN(cellNumber)) {
                        expect(result.data[month]).toBe(0);
                    } else {
                        expect(result.data[month]).toBe(cellNumber);
                    }
                });

                MONTHS.forEach((month) => {
                    expect(result.data[`${month}_paid`]).toBe(false);
                });
                expect(result.data.paid).toBe(false);
                expect(result.data.total).toBe(0);
                expect(typeof result.data.supplier).toBe('string');
                expect(Array.isArray(result.supplierList)).toBe(true);
            });

            it('should work if supplierList is not passed.', () => {
                const cells = [
                    'SupplierX', 1,1,1,1,1,1,1,1,1,1,1,1, 'NO', '12'
                ];
                buildMockWorksheet(cells);

                const result = business.buildCreditCardBodyData({
                    row: 1,
                    bill: mockEntity,
                    column: 1,
                    isParent: false,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: undefined,
                });

                expect(result.supplierList).toEqual([]);
                expect(result.data.is_aggregate).toBe(true);
            });

            it('should work with all default values and supplier not found.', () => {
                const cells = new Array(15).fill(undefined);
                buildMockWorksheet(cells);

                const result = business.buildCreditCardBodyData({
                    row: 1,
                    bill: { ...mockEntity, name: 'OTHER CARD' },
                    column: 1,
                    isParent: true,
                    groupName: 'OTHER CARD',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: undefined,
                });

                expect(result.data.supplier).toBe('');
                expect(result.data.total).toBe(0);
                expect(result.data.paid).toBe(false);
            });

            it('should return aggregate_name as empty string when cleanTextByListText returns undefined.', () => {

                jest.spyOn(stringUtils, 'cleanTextByListText')
                    .mockImplementationOnce(() => 'SupplierX')
                    .mockImplementationOnce(() => undefined);

                const row = 1;
                const column = 1;
                spreadsheetMock.workSheet.cell.mockReturnValue({ value: 'SupplierX' } as any);

                const business = new BillBusiness();
                const result = business.buildCreditCardBodyData({
                    row,
                    bill: mockEntity,
                    column,
                    isParent: true,
                    groupName: 'GroupName',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: []
                });

                expect(result.data.aggregate_name).toBe('');
            });
        });
    });

});