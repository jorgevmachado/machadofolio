import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { MONTHS, type TMonth } from '@repo/services/date/month/month';
import { EMonth } from '@repo/services/date/month/enum';

import { EExpenseType } from '../enum';
import { EXPENSE_MOCK } from '../mock';
import type Expense from '../expense';

import ExpenseBusiness from './business';

describe('Expense Business', () => {
    const business = new ExpenseBusiness();
    const mockEntity: Expense = EXPENSE_MOCK;
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('initialize', () => {
        it('should initialize a FIXED expense correctly', () => {
            const year = 2025;
            const type = EExpenseType.FIXED;
            const value = 93.59;
            const instalment_number = 12;
            const expenseFixed: Expense = {
                ...mockEntity,
                id: undefined,
                year,
                paid: true,
                name: `${mockEntity.bill.name} ${mockEntity.supplier.name}`,
                type,
                supplier: mockEntity.supplier,
                created_at: undefined,
                updated_at: undefined,
                description: undefined,
                instalment_number,
            };

            MONTHS.forEach((month) => {
                expenseFixed[`${month}_paid`] = true;
                expenseFixed[`${month}`] = 0;
            });


            const result = business.initialize(expenseFixed, value );

            expect(result.nextYear).toBe(year + 1);
            expect(result.requiresNewBill).toBeFalsy();
            expect(result.expenseForNextYear).toBeUndefined();
            expect(result.expenseForCurrentYear.id).toBeUndefined();
            expect(result.expenseForCurrentYear.name).toEqual(expenseFixed.name);
            expect(result.expenseForCurrentYear.year).toEqual(expenseFixed.year);
            expect(result.expenseForCurrentYear.bill).toEqual(expenseFixed.bill);
            expect(result.expenseForCurrentYear.type).toEqual(type);
            expect(result.expenseForCurrentYear.paid).toBeTruthy();
            expect(result.expenseForCurrentYear.total).toEqual(100);
            expect(result.expenseForCurrentYear.supplier).toEqual(expenseFixed.supplier);
            expect(result.expenseForCurrentYear.name_code).toEqual(expenseFixed.name_code);
            expect(result.expenseForCurrentYear.total_paid).toEqual(0);
            expect(result.expenseForCurrentYear.january).toEqual(93.59);
            expect(result.expenseForCurrentYear.january_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.february).toEqual(93.59);
            expect(result.expenseForCurrentYear.february_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.march).toEqual(93.59);
            expect(result.expenseForCurrentYear.march_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.april).toEqual(93.59);
            expect(result.expenseForCurrentYear.april_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.may).toEqual(93.59);
            expect(result.expenseForCurrentYear.may_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.june).toEqual(93.59);
            expect(result.expenseForCurrentYear.june_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.july).toEqual(93.59);
            expect(result.expenseForCurrentYear.july_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.august).toEqual(93.59);
            expect(result.expenseForCurrentYear.august_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.september).toEqual(93.59);
            expect(result.expenseForCurrentYear.september_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.october).toEqual(93.59);
            expect(result.expenseForCurrentYear.october_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.november).toEqual(93.59);
            expect(result.expenseForCurrentYear.november_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.december).toEqual(93.59);
            expect(result.expenseForCurrentYear.december_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.description).toBeUndefined();
            expect(result.expenseForCurrentYear.created_at).toBeUndefined();
            expect(result.expenseForCurrentYear.updated_at).toBeUndefined();
            expect(result.expenseForCurrentYear.deleted_at).toBeUndefined();
            expect(result.expenseForCurrentYear.instalment_number).toEqual(12);
        });

        it('should initialize a variable expense correctly with instalment_number equal 2', () => {
            const mockDate = new Date(2023, 0, 1);
            jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);
            const year = 2025;
            const type = EExpenseType.VARIABLE;
            const value = 50;
            const instalment_number = 2;
            const expenseVariableInstalmentNumber: Expense = {
                ...mockEntity,
                id: undefined,
                year,
                bill: mockEntity.bill,
                name: `${mockEntity.bill.name} ${mockEntity.supplier.name}`,
                type,
                paid: true,
                total: 0,
                supplier: mockEntity.supplier,
                total_paid: 0,
                created_at: undefined,
                updated_at: undefined,
                description: undefined,
                instalment_number,
            };

            MONTHS.forEach((month) => {
                expenseVariableInstalmentNumber[`${month}_paid`] = true;
                expenseVariableInstalmentNumber[`${month}`] = 0;
            });

            const result = business.initialize(
                expenseVariableInstalmentNumber,
                value,
             );

            expect(result.nextYear).toBe(2026);
            expect(result.requiresNewBill).toBeFalsy();
            expect(result.expenseForNextYear).toBeUndefined();
            expect(result.expenseForCurrentYear.id).toBeUndefined();
            expect(result.expenseForCurrentYear.name).toEqual(expenseVariableInstalmentNumber.name);
            expect(result.expenseForCurrentYear.year).toEqual(expenseVariableInstalmentNumber.year);
            expect(result.expenseForCurrentYear.bill).toEqual(expenseVariableInstalmentNumber.bill);
            expect(result.expenseForCurrentYear.type).toEqual(type);
            expect(result.expenseForCurrentYear.paid).toBeTruthy();
            expect(result.expenseForCurrentYear.total).toEqual(0);
            expect(result.expenseForCurrentYear.supplier).toEqual(
                expenseVariableInstalmentNumber.supplier,
            );
            expect(result.expenseForCurrentYear.name_code).toEqual(
                expenseVariableInstalmentNumber.name_code,
            );
            expect(result.expenseForCurrentYear.total_paid).toEqual(0);
            expect(result.expenseForCurrentYear.january).toEqual(50);
            expect(result.expenseForCurrentYear.january_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.february).toEqual(50);
            expect(result.expenseForCurrentYear.february_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.march).toEqual(0);
            expect(result.expenseForCurrentYear.march_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.april).toEqual(0);
            expect(result.expenseForCurrentYear.april_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.may).toEqual(0);
            expect(result.expenseForCurrentYear.may_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.june).toEqual(0);
            expect(result.expenseForCurrentYear.june_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.july).toEqual(0);
            expect(result.expenseForCurrentYear.july_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.august).toEqual(0);
            expect(result.expenseForCurrentYear.august_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.september).toEqual(0);
            expect(result.expenseForCurrentYear.september_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.october).toEqual(0);
            expect(result.expenseForCurrentYear.october_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.november).toEqual(0);
            expect(result.expenseForCurrentYear.november_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.december).toEqual(0);
            expect(result.expenseForCurrentYear.december_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.description).toBeUndefined();
            expect(result.expenseForCurrentYear.created_at).toBeUndefined();
            expect(result.expenseForCurrentYear.updated_at).toBeUndefined();
            expect(result.expenseForCurrentYear.deleted_at).toBeUndefined();
            expect(result.expenseForCurrentYear.instalment_number).toEqual(2);
        });

        it('should initialize a variable expense correctly with instalment_number equal 12 and expenseForNextYear', () => {
            const year = 2025;
            const value = 20;
            const month = EMonth.MARCH;
            const instalment_number = 12;
            const expenseVariableWithNextYear: Expense = {
                ...mockEntity,
                id: undefined,
                year,
                bill: mockEntity.bill,
                name: `${mockEntity.bill.name} ${mockEntity.supplier.name}`,
                type: EExpenseType.VARIABLE,
                paid: false,
                total: 0,
                supplier: mockEntity.supplier,
                total_paid: 0,
                created_at: undefined,
                updated_at: undefined,
                description: undefined,
                instalment_number,
            };

            MONTHS.forEach((month) => {
                expenseVariableWithNextYear[`${month}_paid`] = true;
                expenseVariableWithNextYear[`${month}`] = 0;
            });

            const result = business.initialize(
                expenseVariableWithNextYear,
                value,
                month,
            );

            expect(result.nextYear).toBe(2026);
            expect(result.requiresNewBill).toBeTruthy();
            expect(result.expenseForCurrentYear.id).toBeUndefined();
            expect(result.expenseForCurrentYear.name).toEqual(expenseVariableWithNextYear.name);
            expect(result.expenseForCurrentYear.year).toEqual(expenseVariableWithNextYear.year);
            expect(result.expenseForCurrentYear.bill).toEqual(expenseVariableWithNextYear.bill);
            expect(result.expenseForCurrentYear.type).toEqual(EExpenseType.VARIABLE);
            expect(result.expenseForCurrentYear.paid).toBeFalsy();
            expect(result.expenseForCurrentYear.total).toEqual(0);
            expect(result.expenseForCurrentYear.supplier).toEqual(
                expenseVariableWithNextYear.supplier,
            );
            expect(result.expenseForCurrentYear.name_code).toEqual(
                expenseVariableWithNextYear.name_code,
            );
            expect(result.expenseForCurrentYear.total_paid).toEqual(0);
            expect(result.expenseForCurrentYear.january).toEqual(0);
            expect(result.expenseForCurrentYear.january_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.february).toEqual(0);
            expect(result.expenseForCurrentYear.february_paid).toBeTruthy();
            expect(result.expenseForCurrentYear.march).toEqual(20);
            expect(result.expenseForCurrentYear.march_paid).toBeFalsy();
            expect(result.expenseForCurrentYear.april).toEqual(20);
            expect(result.expenseForCurrentYear.april_paid).toBeFalsy();
            expect(result.expenseForCurrentYear.may).toEqual(20);
            expect(result.expenseForCurrentYear.may_paid).toBeFalsy();
            expect(result.expenseForCurrentYear.june).toEqual(20);
            expect(result.expenseForCurrentYear.june_paid).toBeFalsy();
            expect(result.expenseForCurrentYear.july).toEqual(20);
            expect(result.expenseForCurrentYear.july_paid).toBeFalsy();
            expect(result.expenseForCurrentYear.august).toEqual(20);
            expect(result.expenseForCurrentYear.august_paid).toBeFalsy();
            expect(result.expenseForCurrentYear.september).toEqual(20);
            expect(result.expenseForCurrentYear.september_paid).toBeFalsy();
            expect(result.expenseForCurrentYear.october).toEqual(20);
            expect(result.expenseForCurrentYear.october_paid).toBeFalsy();
            expect(result.expenseForCurrentYear.november).toEqual(20);
            expect(result.expenseForCurrentYear.november_paid).toBeFalsy();
            expect(result.expenseForCurrentYear.december).toEqual(20);
            expect(result.expenseForCurrentYear.december_paid).toBeFalsy();
            expect(result.expenseForCurrentYear.description).toBeUndefined();
            expect(result.expenseForCurrentYear.created_at).toBeUndefined();
            expect(result.expenseForCurrentYear.updated_at).toBeUndefined();
            expect(result.expenseForCurrentYear.deleted_at).toBeUndefined();
            expect(result.expenseForCurrentYear.instalment_number).toEqual(10);

            expect(result.expenseForNextYear?.id).toEqual('');
            expect(result.expenseForNextYear?.name).toEqual(expenseVariableWithNextYear.name);
            expect(result.expenseForNextYear?.year).toEqual(2026);
            expect(result.expenseForNextYear?.type).toEqual(EExpenseType.VARIABLE);
            expect(result.expenseForNextYear?.paid).toBeFalsy();
            expect(result.expenseForNextYear?.total).toEqual(0);
            expect(result.expenseForNextYear?.supplier).toEqual(
                expenseVariableWithNextYear.supplier,
            );
            expect(result.expenseForNextYear?.name_code).toEqual(
                expenseVariableWithNextYear.name_code,
            );
            expect(result.expenseForNextYear?.total_paid).toEqual(0);
            expect(result.expenseForNextYear?.january).toEqual(20);
            expect(result.expenseForNextYear?.january_paid).toBeFalsy();
            expect(result.expenseForNextYear?.february).toEqual(20);
            expect(result.expenseForNextYear?.february_paid).toBeFalsy();
            expect(result.expenseForNextYear?.march).toEqual(0);
            expect(result.expenseForNextYear?.march_paid).toBeTruthy();
            expect(result.expenseForNextYear?.april).toEqual(0);
            expect(result.expenseForNextYear?.april_paid).toBeTruthy();
            expect(result.expenseForNextYear?.may).toEqual(0);
            expect(result.expenseForNextYear?.may_paid).toBeTruthy();
            expect(result.expenseForNextYear?.june).toEqual(0);
            expect(result.expenseForNextYear?.june_paid).toBeTruthy();
            expect(result.expenseForNextYear?.july).toEqual(0);
            expect(result.expenseForNextYear?.july_paid).toBeTruthy();
            expect(result.expenseForNextYear?.august).toEqual(0);
            expect(result.expenseForNextYear?.august_paid).toBeTruthy();
            expect(result.expenseForNextYear?.september).toEqual(0);
            expect(result.expenseForNextYear?.september_paid).toBeTruthy();
            expect(result.expenseForNextYear?.october).toEqual(0);
            expect(result.expenseForNextYear?.october_paid).toBeTruthy();
            expect(result.expenseForNextYear?.november).toEqual(0);
            expect(result.expenseForNextYear?.november_paid).toBeTruthy();
            expect(result.expenseForNextYear?.december).toEqual(0);
            expect(result.expenseForNextYear?.december_paid).toBeTruthy();
            expect(result.expenseForNextYear?.description).toBeUndefined();
            expect(result.expenseForNextYear?.created_at).toBeUndefined();
            expect(result.expenseForNextYear?.updated_at).toBeUndefined();
            expect(result.expenseForNextYear?.deleted_at).toBeUndefined();
            expect(result.expenseForNextYear?.instalment_number).toEqual(2);
        });
    });

    describe('calculate', () => {
        it('should calculate correctly for a fixed expense', () => {
            const expenseFixed: Expense = {
                ...mockEntity,
                id: undefined,
                year: 2025,
                name: mockEntity.name,
                type: EExpenseType.FIXED,
                paid: true,
                total: 0,
                supplier: mockEntity.supplier,
                total_paid: 0,
                description: undefined,
                created_at: undefined,
                updated_at: undefined,
                deleted_at: undefined,
                instalment_number: 12,
            };

            MONTHS.forEach((month) => {
                expenseFixed[`${month}_paid`] = true;
                expenseFixed[`${month}`] = 93.59;
            });

            const result = business.calculate(expenseFixed);
            expect(result.paid).toBeTruthy();
            expect(result.total).toEqual(1123.08);
            expect(result.total_paid).toEqual(1123.08);
        });

        it('should calculate correctly for a variable expense', () => {
            const expenseVariable: Expense = {
                ...mockEntity,
                id: undefined,
                year: 2025,
                name: mockEntity.name,
                type: EExpenseType.VARIABLE,
                paid: false,
                total: 0,
                supplier: mockEntity.supplier,
                total_paid: 0,
                description: undefined,
                created_at: undefined,
                updated_at: undefined,
                deleted_at: undefined,
                instalment_number: 2,
            };
            MONTHS.forEach((month) => {
                expenseVariable[`${month}_paid`] = true;
                expenseVariable[`${month}`] = 0;
            });

            const months: Array<TMonth> = ['january', 'february'];
            months.forEach((month) => {
                expenseVariable[`${month}_paid`] = false;
                expenseVariable[`${month}`] = 93.59;
            });

            const result = business.calculate(expenseVariable);
            expect(result.paid).toBeFalsy();
            expect(result.total).toEqual(187.18);
            expect(result.total_paid).toEqual(0);
        });
    });

    describe('reinitialize', () => {
        const mock = { ...mockEntity };
        const expense: Expense = {
            ...mock,
            id: undefined,
            paid: true,
            type: EExpenseType.VARIABLE,
            total: 0,
            total_paid: 0,
            instalment_number: 2,
        };
        MONTHS.forEach((month) => {
            expense[`${month}_paid`] = true;
            expense[`${month}`] = 50;
        });
        const existingExpense: Expense = {
            ...mock,
            paid: true,
            total: 0,
            total_paid: 0,
        };
        MONTHS.forEach((month) => {
            existingExpense[`${month}_paid`] = true;
            existingExpense[`${month}`] = 50;
        });
        it('should return a expense when existingExpense is undefined', () => {
            const result = business.reinitialize( [], expense );
            expect(result.id).toBeUndefined();
            expect(result.name).toEqual(expense.name);
            expect(result.year).toEqual(expense.year);
            expect(result.bill).toEqual(expense.bill);
            expect(result.type).toEqual(expense.type);
            expect(result.paid).toBeTruthy();
            expect(result.total).toEqual(0);
            expect(result.january).toEqual(expense.january);
            expect(result.february).toEqual(expense.february);
            expect(result.supplier).toEqual(expense.supplier);
            expect(result.name_code).toEqual(expense.name_code);
            expect(result.total_paid).toEqual(0);
        });

        it('should return a expense when existingExpense is defined', () => {
            const result = business.reinitialize(['january', 'february'], expense, existingExpense);
            expect(result.id).toEqual(existingExpense.id);
            expect(result.name).toEqual(existingExpense.name);
            expect(result.year).toEqual(existingExpense.year);
            expect(result.bill).toEqual(existingExpense.bill);
            expect(result.type).toEqual(existingExpense.type);
            expect(result.january).toEqual(100);
            expect(result.february).toEqual(100);
            expect(result.paid).toBeTruthy();
            expect(result.total).toEqual(0);
            expect(result.supplier).toEqual(existingExpense.supplier);
            expect(result.name_code).toEqual(existingExpense.name_code);
        });
    });

    describe('buildTablesParams', () => {
        const tableWidth = 3;
        it('Should build table parameters correctly.', () => {
            const result = business.buildTablesParams([mockEntity], tableWidth);
            expect(result).toHaveProperty('tables');
            expect(Array.isArray(result.tables)).toBe(true);
            expect(result.tableWidth).toBe(tableWidth);
            expect(result.tables[0].title).toBeDefined();
            expect(Array.isArray(result.tables[0].data)).toBe(true);
        });

        it('Should build the table parameters correctly with the default title.', () => {
            const result = business.buildTablesParams([{ ...mockEntity, supplier: undefined }], tableWidth);
            expect(result.tables[0].title).toEqual('expense');
        });
    });

    describe('totalByMonth', () => {
        it('Should add the value of each month between expenses', () => {
            const sumJanuary = business.totalByMonth('january', [mockEntity]);
            expect(sumJanuary).toBe(100);

            const sumFebruary = business.totalByMonth('february', [mockEntity]);
            expect(sumFebruary).toBe(0);

            const sumMarch = business.totalByMonth('march', [mockEntity]);
            expect(sumMarch).toBe(0);
        });

    });

    describe('allHaveBeenPaid', () => {
        it('Should return false because the expense list is empty.', () => {
            const result = business.allHaveBeenPaid([]);
            expect(result).toBeFalsy();
        });

        it('Should return false as all expenses have not been paid.', () => {
            const result = business.allHaveBeenPaid([mockEntity]);
            expect(result).toBeFalsy();
        });

        it('Should return true since all expenses have been paid.', () => {
            const mockEntityAllPaid = { ...mockEntity, paid: true };
            const result = business.allHaveBeenPaid([mockEntityAllPaid]);
            expect(result).toBeTruthy();
        });
    });
});