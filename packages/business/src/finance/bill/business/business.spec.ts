import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from '@jest/globals';

import { type Spreadsheet } from '@repo/services/spreadsheet/spreadsheet';
import type { TablesParams } from '@repo/services/spreadsheet/table/types';

import {  EXPENSE_PARENT_MOCK } from '../../expense';
import type Expense from '../../expense';

import { BILL_MOCK } from '../mock';
import type Bill from '../bill';
import { EBillType } from '../enum';

import BillBusiness from './business';

import type { SpreadsheetProcessingParams } from './types';

const sheet = {
    addTable: jest.fn(),
    addTables: jest.fn(),
    calculateTablesParamsNextRow: jest.fn(({ startRow = 0, totalTables = 0, linesPerTable = 0 }) => (
        startRow + (totalTables * (linesPerTable + 1))
    )),
    calculateTableHeight: jest.fn(({ total }) => total || 0),
    cell: { add: jest.fn() },
} as unknown as Spreadsheet;


const buildExpensesTablesParams: jest.MockedFunction<(expenses: Array<Expense>, tableWidth: number) => TablesParams> = jest.fn();

const totalExpenseByMonth = jest.fn(() => 100);
const allExpensesHaveBeenPaid = jest.fn(() => true);

describe('Bill Business', () => {
    let business: BillBusiness;

    const mockEntity: Bill = BILL_MOCK;
    const mockExpense: Expense = EXPENSE_PARENT_MOCK;
    const mockExpenses: Array<Expense> = [mockExpense];
    beforeEach(() => {
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
            headers: [ 'month', 'value', 'paid' ],
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
        it('Shouldn\'t do anything because the bills is empty.', () => {
            business.spreadsheetProcessing({
                sheet,
                bills: [],
                totalExpenseByMonth,
                allExpensesHaveBeenPaid,
                buildExpensesTablesParams
            });

            expect(sheet.addTable).not.toHaveBeenCalled();
            expect(sheet.addTables).not.toHaveBeenCalled();
        });

        it('Processes normally with basic bills.', () => {
            const params: SpreadsheetProcessingParams = {
                sheet,
                bills: [{ ...mockEntity, type: EBillType.BANK_SLIP, expenses: mockExpenses }],
                buildExpensesTablesParams,
                groupsName: undefined,
                headers: undefined,
                startColumn: 0,
                startRow: 0,
                tableWidth: 0,
                totalExpenseByMonth,
                allExpensesHaveBeenPaid
            };
            business.spreadsheetProcessing(params);
            expect(sheet.addTable).toHaveBeenCalled();
            expect(sheet.addTables).toHaveBeenCalled();

        });

        it('Covers flow with childrenTables.', () => {
            const params: SpreadsheetProcessingParams = {
                sheet,
                bills: [
                    { ...mockEntity, type: EBillType.BANK_SLIP, expenses: mockExpenses },
                    { ...mockEntity, type: EBillType.BANK_SLIP, expenses: undefined },
                    { ...mockEntity, expenses: mockExpenses },
                    { ...mockEntity, expenses: [{ ...mockExpense, children: undefined }] },
                    { ...mockEntity },
                ],
                buildExpensesTablesParams,
                groupsName: undefined,
                headers: undefined,
                startColumn: 0,
                startRow: 0,
                tableWidth: 0,
                totalExpenseByMonth,
                allExpensesHaveBeenPaid
            };
            business.spreadsheetProcessing(params);
            expect(sheet.addTable).toHaveBeenCalled();
            expect(sheet.addTables).toHaveBeenCalled();
        });
    });
    
});