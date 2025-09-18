import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import * as services from '@repo/services';
import { type CycleOfMonths, EMonth, MONTHS, type Spreadsheet, type TMonth } from '@repo/services';

import { BILL_MOCK, EXPENSE_MOCK } from '../../mock';
import type { Bill } from '../../bill';
import { EBillType } from '../../bill';

import { EExpenseType } from '../enum';
import type Expense from '../expense';

import ExpenseBusiness from './business';

jest.mock('@repo/services', () => {
    const originalModule = jest.requireActual('@repo/services');
    return {
        ...((typeof originalModule === 'object' && originalModule !== null) ? originalModule : {}),
        Spreadsheet: jest.fn(),
        getCurrentMonth: jest.fn(),
        cleanTextByListText: jest.fn(),
    };
});


describe('Expense Business', () => {
    let business: ExpenseBusiness;
    const mockEntity: Expense = EXPENSE_MOCK;
    const mockBillEntity: Bill = BILL_MOCK;

    let spreadsheetMock: jest.Mocked<Spreadsheet>;
    
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
        jest.spyOn(services, 'Spreadsheet').mockReturnValue(spreadsheetMock);
        jest.clearAllMocks();
        jest.restoreAllMocks();
        business = new ExpenseBusiness();
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    describe('initialize', () => {
        xit('should initialize a FIXED expense correctly', () => {
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

        xit('should initialize a variable expense correctly with instalment_number equal 2', () => {
            jest.spyOn(services, 'getCurrentMonth').mockReturnValue(EMonth.JANUARY);

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
                january: 50,
                february: 50,
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

        xit('should initialize a variable expense correctly with instalment_number equal 12 and expenseForNextYear', () => {
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
                total: 100,
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
            expect(result.expenseForCurrentYear.total).toEqual(100);
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
            expect(result.expenseForNextYear?.total).toEqual(100);
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
        xit('should calculate correctly for a fixed expense', () => {
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

        xit('should calculate correctly for a variable expense', () => {
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
        xit('should return a expense when existingExpense is undefined', () => {
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

        xit('should return a expense when existingExpense is defined', () => {
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
        xit('Should build table parameters correctly.', () => {
            const result = business.buildTablesParams([mockEntity], tableWidth);
            expect(result).toHaveProperty('tables');
            expect(Array.isArray(result.tables)).toBe(true);
            expect(result.tableWidth).toBe(tableWidth);
            expect(result.tables[0].title).toBeDefined();
            expect(Array.isArray(result.tables[0].data)).toBe(true);
        });

        xit('Should build the table parameters correctly with the default title.', () => {
            const result = business.buildTablesParams([{ ...mockEntity, supplier: undefined }], tableWidth);
            expect(result.tables[0].title).toEqual('expense');
        });
    });

    describe('totalByMonth', () => {
        xit('Should add the value of each month between expenses', () => {
            const sumJanuary = business.totalByMonth('january', [mockEntity]);
            expect(sumJanuary).toBe(100);

            const sumFebruary = business.totalByMonth('february', [mockEntity]);
            expect(sumFebruary).toBe(0);

            const sumMarch = business.totalByMonth('march', [mockEntity]);
            expect(sumMarch).toBe(0);
        });
    });

    describe('allHaveBeenPaid', () => {
        xit('Should return false because the expense list is empty.', () => {
            const result = business.allHaveBeenPaid([]);
            expect(result).toBeFalsy();
        });

        xit('Should return false as all expenses have not been paid.', () => {
            const result = business.allHaveBeenPaid([mockEntity]);
            expect(result).toBeFalsy();
        });

        xit('Should return true since all expenses have been paid.', () => {
            const mockEntityAllPaid = { ...mockEntity, paid: true };
            const result = business.allHaveBeenPaid([mockEntityAllPaid]);
            expect(result).toBeTruthy();
        });
    });

    describe('parseToDetailsTable', () => {
        const secondaryBill = { ...mockBillEntity, type: EBillType.PIX };
        const creditCardBill = { ...mockBillEntity, type: EBillType.CREDIT_CARD };

        xit('deve retornar array vazio se não houver bills', () => {
            jest.spyOn(business, 'generateDetailsTable' as any).mockReturnValue({ data: [], nextRow: 10 });
            jest.spyOn(business, 'generateCreditCardTable' as any).mockReturnValue({ data: [], nextRow: 10 });

            const result = business.parseToDetailsTable({
                bills: [],
                startRow: 2,
                groupName: 'ANY',
                workSheet: spreadsheetMock.workSheet,
            });
            expect(result).toEqual([]);
        });

        xit('deve retornar uma lista de despesas', () => {
            const bills = [secondaryBill, creditCardBill];

            const generateDetailsTable = jest
                .spyOn(business, 'generateDetailsTable' as any)
                .mockReturnValue({ data: [{ e: 1 }], nextRow: 5 });

            const generateCreditCardTable = jest
                .spyOn(business, 'generateCreditCardTable' as any)
                .mockReturnValue({ data: [{ cc: 99 }], nextRow: 6 });

            const result = business.parseToDetailsTable({
                bills,
                startRow: 2,
                groupName: 'GRUPO-X',
                workSheet: spreadsheetMock.workSheet,
            });

            expect(generateDetailsTable).toHaveBeenCalledWith({
                bills: [secondaryBill],
                startRow: 2,
                workSheet: spreadsheetMock.workSheet,
            });

            expect(generateCreditCardTable).toHaveBeenCalledWith({
                bills: [creditCardBill],
                groupName: 'GRUPO-X',
                startRow: 5,
                workSheet: spreadsheetMock.workSheet,
            });

            expect(result).toEqual([{ e: 1 }, { cc: 99 }]);
        });

        xit('não adiciona secundário se nextRow não mudar', () => {

            jest
                .spyOn(business, 'generateDetailsTable' as any)
                .mockReturnValue({ data: [{ e: 'x' }], nextRow: 2 });

            jest
                .spyOn(business, 'generateCreditCardTable' as any)
                .mockReturnValue({ data: [{ cc: 24 }], nextRow: 5 });

            const result = business.parseToDetailsTable({
                bills: [secondaryBill, creditCardBill],
                startRow: 2,
                groupName: 'g',
                workSheet: spreadsheetMock.workSheet,
            });

            expect(result).toEqual([{ cc: 24 }]);
        });

        xit('não adiciona creditcard se nextRow não mudar', () => {

            jest
                .spyOn(business, 'generateDetailsTable' as any)
                .mockReturnValue({ data: [{ e: 'x' }], nextRow: 10 });

            jest
                .spyOn(business, 'generateCreditCardTable' as any)
                .mockReturnValue({ data: [{ cc: 77 }], nextRow: 10 });

            const result = business.parseToDetailsTable({
                bills: [secondaryBill, creditCardBill],
                startRow: 2,
                groupName: 'abc',
                workSheet: spreadsheetMock.workSheet,
            });

            expect(result).toEqual([{ e: 'x' }]);
        });

        xit('retorna apenas creditcard se não houver secondary', () => {

            jest
                .spyOn(business, 'generateDetailsTable' as any)
                .mockReturnValue({ data: [], nextRow: 5 });

            jest
                .spyOn(business, 'generateCreditCardTable' as any)
                .mockReturnValue({ data: [{ cc: 1 }], nextRow: 7 });

            const result = business.parseToDetailsTable({
                bills: [creditCardBill],
                startRow: 3,
                groupName: 'q',
                workSheet: spreadsheetMock.workSheet,
            });

            expect(result).toEqual([{ cc: 1 }]);
        });

        xit('retorna apenas secondary se não houver creditcard', () => {

            jest
                .spyOn(business, 'generateDetailsTable' as any)
                .mockReturnValue({ data: [{ s: 123 }], nextRow: 5 });

            jest
                .spyOn(business, 'generateCreditCardTable' as any)
                .mockReturnValue({ data: [], nextRow: 5 });

            const result = business.parseToDetailsTable({
                bills: [secondaryBill],
                startRow: 4,
                groupName: 'g',
                workSheet: spreadsheetMock.workSheet,
            });

            expect(result).toEqual([{ s: 123 }]);
        });

        xit('retorna vazio se ambos não forem adicionados', () => {
            jest
                .spyOn(business, 'generateDetailsTable' as any)
                .mockReturnValue({ data: [], nextRow: 4 });

            jest
                .spyOn(business, 'generateCreditCardTable' as any)
                .mockReturnValue({ data: [], nextRow: 4 });

            const result = business.parseToDetailsTable({
                bills: [secondaryBill, creditCardBill],
                startRow: 4,
                groupName: 'g',
                workSheet: spreadsheetMock.workSheet,
            });

            expect(result).toEqual([]);
        });
    });

    describe('calculateAll', () => {
        xit('should return 0 and true in all values when the expense list is empty.', () => {
            const result = business.calculateAll([]);
            expect(result.total).toEqual(0);
            expect(result.allPaid).toBeTruthy();
            expect(result.totalPaid).toEqual(0);
            expect(result.totalPending).toEqual(0);
        });

        xit('should calculated all and return correctly values.', () => {
            const result = business.calculateAll([mockEntity,mockEntity,mockEntity,mockEntity]);
            expect(result.total).toEqual(400);
            expect(result.allPaid).toBeFalsy();
            expect(result.totalPaid).toEqual(0);
            expect(result.totalPending).toEqual(400);
        });
    });


    describe('private', () => {

        describe('generateDetailsTable', () => {
            xit('should return acc and nextRow when cell value is empty.', () => {
                spreadsheetMock.workSheet.cell.mockReturnValueOnce(undefined as any);
                const result = business['generateDetailsTable']({
                    bills: [mockBillEntity],
                    startRow: 10,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result.data).toEqual([]);
                expect(result.nextRow).toBe(10);
            });

            xit('should return acc and nextRow when type does not exist in bills.', () => {
                spreadsheetMock.workSheet.cell.mockReturnValueOnce({ value: 'UNKNOWN_TYPE' } as any);

                const result = business['generateDetailsTable']({
                    bills: [mockBillEntity],
                    startRow: 5,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result.data).toEqual([]);
                expect(result.nextRow).toBe(5);
            });

            xit('should recurse and accumulate correctly when the type exists and accumulateGroupTables is called.', () => {
                const billTypeBankSlipMock = { ...mockBillEntity, type: EBillType.BANK_SLIP };
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


                const result = business['generateDetailsTable']({
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

            xit('must handle multiple recursive calls if applicable.', () => {
                const billTypeBankSlipMock = { ...mockBillEntity, type: EBillType.BANK_SLIP };
                const billTypeAccountDebitMock = { ...mockBillEntity, type: EBillType.ACCOUNT_DEBIT };

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

                const accumulateSpy = jest.spyOn(business as any, 'accumulateGroupTables')
                    .mockImplementation(({ acc }: any) => {
                        if (acc.length === 0) {
                            return { acc: ['A'], lastRow: 11 };
                        }
                        if (acc.length === 1) {
                            return { acc: ['A', 'B'], lastRow: 21 };
                        }
                        return { acc: ['A', 'B', 'C'], lastRow: 31 };
                    });

                const result = business['generateDetailsTable']({
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

        describe('buildDetailData', () => {
            xit('should return undefined if the title value is empty.', () => {
                const result = business['buildDetailData']({
                    row: 5,
                    bill: mockBillEntity,
                    cell: { value: undefined } as any,
                    column: 2,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(result).toBeUndefined();
            });

            xit('should return undefined if cell.value is empty string.', () => {
                const result = business['buildDetailData']({
                    row: 5,
                    bill: mockBillEntity,
                    cell: { value: '     ' } as any,
                    column: 2,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(result).toBeUndefined();
            });

            xit('should return the correctly populated BuildDetailData object.', () => {
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
                    bill: mockBillEntity,
                    column: 5,
                    workSheet: spreadsheetMock.workSheet,
                });

                expect(result).toBeDefined();
                expect(result?.supplier).toBe('SupplierX');
                expect(result?.bill).toBe(mockBillEntity);
                MONTHS.forEach((m, i) => {
                    expect(result?.[m]).toBe(mockValues[i]);
                    expect(result?.[`${m}_paid`]).toBe(mockPaid[i] === 'YES');
                });
            });

            xit('must use value 0 and paid NO when cells return empty/undefined.', () => {
                spreadsheetMock.workSheet.cell.mockImplementation(() => ({ value: undefined }) as any);
                const result = business['buildDetailData']({
                    row: 100,
                    cell: { value: 'SupplierEmpty' } as any,
                    bill: mockBillEntity,
                    column: 10,
                    workSheet: spreadsheetMock.workSheet,
                });
                expect(result).toBeDefined();
                expect(result?.supplier).toBe('SupplierEmpty');
                expect(result?.bill).toBe(mockBillEntity);

                for (const month of MONTHS) {
                    expect(result?.[month]).toBe(0);
                    expect(result?.[`${month}_paid`]).toBe(false);
                }
            });

            xit('must trim the title correctly.', () => {
                spreadsheetMock.workSheet.cell.mockImplementation((row, column) => {
                    if (Number(column) % 2 === 0) {
                        return { value: 7 } as any;
                    }
                    return { value: 'YES' } as any;
                });

                const result = business['buildDetailData']({
                    row: 0,
                    cell: { value: '   MySupplier   ' } as any,
                    bill: mockBillEntity,
                    column: 2,
                    workSheet: spreadsheetMock.workSheet,
                });
                expect(result).toBeDefined();
                expect(result?.supplier).toBe('MySupplier');
            });
        });

        describe('buildGroupTable', () => {
            xit('should return correct object when cell is merged (_mergeCount === 2).', () => {

                const buildDetailDataMock = jest.spyOn(business, 'buildDetailData' as any)
                    .mockImplementation(({ column }: any) => ({ column, key: `mock${column}` }));

                spreadsheetMock.workSheet.cell
                    .mockReturnValueOnce({ isMerged: true, _mergeCount: 2 } as any)
                    .mockReturnValueOnce({} as any)
                    .mockReturnValueOnce({} as any);

                const result = business['buildGroupTable']({
                    row: 10,
                    bill: mockBillEntity,
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

            xit('should skip null/undefined data from buildDetailData.', () => {
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
                    bill: mockBillEntity,
                    workSheet: spreadsheetMock.workSheet,
                });

                expect(result.data).toHaveLength(1);
                expect(result.data[0]).toEqual(expect.objectContaining({ column: 14 }));
                expect(result.hasNext).toBe(true);
            });

            xit('should return empty data, nextRow equal to row and hasNext false if cell is not merged or mergeCount !== 2.', () => {
                spreadsheetMock.workSheet.cell.mockReturnValue({ isMerged: false, _mergeCount: 2 } as any);

                let result = business['buildGroupTable']({
                    row: 2,
                    bill: mockBillEntity,
                    workSheet: spreadsheetMock.workSheet,
                });
                expect(result).toEqual({ data: [], nextRow: 2, hasNext: false });

                spreadsheetMock.workSheet.cell.mockReturnValue({ isMerged: true, _mergeCount: 3 } as any);

                result = business['buildGroupTable']({
                    row: 5,
                    bill: mockBillEntity,
                    workSheet: spreadsheetMock.workSheet,
                });
                expect(result).toEqual({ data: [], nextRow: 5, hasNext: false });
            });
        });

        describe('accumulateGroupTables', () => {
            xit('should accumulate data when hasNext is false (no recursion).', () => {
                const acc = [{ name: 'item1' }];
                const startRow = 5;

                const buildGroupTableMock = jest.spyOn(business as any, 'buildGroupTable').mockImplementation(() => ({
                    data: [{ name: 'item2' }, { name: 'item3' }],
                    nextRow: 10,
                    hasNext: false
                }));

                const result = business['accumulateGroupTables']({
                    acc,
                    bill: mockBillEntity,
                    startRow,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(buildGroupTableMock).toHaveBeenCalledWith({
                    row: startRow,
                    bill: mockBillEntity,
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

            xit('must accumulate data across multiple recursions when hasNext is true.', () => {
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
                    bill: mockBillEntity,
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

            xit('should return the accumulated amounts correctly even if the data is empty.', () => {
                const acc: any[] = [];
                const startRow = 2;

                const buildGroupTableMock = jest.spyOn(business as any, 'buildGroupTable').mockImplementation(() => ({
                    data: [],
                    nextRow: 7,
                    hasNext: false
                }));

                const result = business['accumulateGroupTables']({
                    acc,
                    bill: mockBillEntity,
                    startRow,
                    workSheet: spreadsheetMock.workSheet,
                });

                expect(result.acc).toEqual([]);
                expect(result.lastRow).toBe(7);
                expect(buildGroupTableMock).toHaveBeenCalledTimes(1);
            });

            xit('must correctly pass accumulated data between recursions.', () => {
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
                    bill: mockBillEntity,
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
                    bill: mockBillEntity,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(buildGroupTableMock).toHaveBeenNthCalledWith(2, {
                    row: 6,
                    bill: mockBillEntity,
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

            xit('should correctly generate the object for the default case (isParent = true).', () => {
                jest.spyOn(services, 'cleanTextByListText').mockImplementationOnce(() => 'Physical');
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

                const result = business['buildCreditCardBodyData']({
                    row: 1,
                    bill: mockBillEntity,
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

                expect(result.data.year).toBe(mockBillEntity.year);
                expect(result.data.bill).toBe(mockBillEntity);
                expect(result.data.supplier).toBe('Physical');
                expect(result.data.is_aggregate).toBe(false);
                expect(result.data.paid).toBe(true);
                expect(result.data.total).toBe(7800);
                expect(result.supplierList).toEqual(['Physical']);
                expect(result.data.aggregate_name).toBe('');
            });

            xit('should generate correctly with isParent = false and supplierList populated.', () => {
                jest.spyOn(services, 'cleanTextByListText')
                    .mockImplementationOnce(() => 'Apache')
                    .mockImplementationOnce(() => 'Physical');
                const supplierList = ['Ifood', 'Physical'];
                const cells = [
                    'Credit Card Nubank Physical Apache', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'NO', '66'
                ];

                buildMockWorksheet(cells);

                const result = business['buildCreditCardBodyData']({
                    row: 1,
                    column: 1,
                    bill: mockBillEntity,
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

            xit('must handle missing values (empty or non-numeric cells).', () => {
                jest.spyOn(services, 'cleanTextByListText').mockImplementationOnce(() => 'string');
                const cells = [
                    '', 'A', null, undefined, '', '1', '2', '3', '4', '5', null, '', // meses
                    '', '',
                ];

                buildMockWorksheet(cells);

                const result = business['buildCreditCardBodyData']({
                    row: 1,
                    bill: mockBillEntity,
                    column: 1,
                    isParent: true,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: undefined,
                });

                MONTHS.forEach((month, i) => {
                    const cell = cells?.[i + 1];
                    const cellNumber = Number(cell);
                    if (Number.isNaN(cellNumber)) {
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

            xit('should work if supplierList is not passed.', () => {
                jest.spyOn(services, 'cleanTextByListText').mockImplementationOnce(() => '');
                const cells = [
                    'SupplierX', 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 'NO', '12'
                ];
                buildMockWorksheet(cells);

                const result = business['buildCreditCardBodyData']({
                    row: 1,
                    bill: mockBillEntity,
                    column: 1,
                    isParent: false,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: undefined,
                });

                expect(result.supplierList).toEqual([]);
                expect(result.data.is_aggregate).toBe(true);
            });

            xit('should work with all default values and supplier not found.', () => {
                jest.spyOn(services, 'cleanTextByListText').mockImplementationOnce(() => '');
                const cells = new Array(15).fill(undefined);
                buildMockWorksheet(cells);

                const result = business['buildCreditCardBodyData']({
                    row: 1,
                    bill: { ...mockBillEntity, name: 'OTHER CARD' },
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

            xit('should return aggregate_name as empty string when cleanTextByListText returns undefined.', () => {

                jest.spyOn(services, 'cleanTextByListText')
                    .mockImplementationOnce(() => 'SupplierX')
                    .mockImplementationOnce(() => undefined);

                const row = 1;
                const column = 1;
                spreadsheetMock.workSheet.cell.mockReturnValue({ value: 'SupplierX' } as any);

                const result = business['buildCreditCardBodyData']({
                    row,
                    bill: mockBillEntity,
                    column,
                    isParent: true,
                    groupName: 'GroupName',
                    workSheet: spreadsheetMock.workSheet,
                    supplierList: []
                });

                expect(result.data.aggregate_name).toBe('');
            });
        });

        describe('generateCreditCardTable', () => {
            const groupName = 'Personal';

            beforeEach(() => {
                jest.clearAllMocks();
                jest.restoreAllMocks();
            });

            afterEach(() => {
                jest.resetModules();
                jest.restoreAllMocks();
            });

            function buildMockWorksheet(rowsProps: Array<any>) {
                spreadsheetMock.workSheet.cell.mockImplementation((row, col) => {
                    const values = rowsProps[row] ?? {};
                    return {
                        value: values.value ?? '',
                        isMerged: values.isMerged ?? false,
                        _mergeCount: values._mergeCount ?? 0
                    } as any;
                });
            }

            function buildCreditCardBodyDataMock(props: Array<any>) {
                const monthsObj = MONTHS.reduce((acc, month) => {
                    acc[month] = 0;
                    acc[`${month}_paid`] = false;
                    return acc;
                }, {} as CycleOfMonths);
                props.forEach((prop, i) => {
                    const { name, supplier, is_aggregate, aggregate_name, supplierList = []  } = prop ?? {};
                    jest.spyOn(business as any, 'buildCreditCardBodyData').mockImplementationOnce(() => ({
                        data: {
                            ...monthsObj,
                            name,
                            year: 2025,
                            paid: false,
                            bill: mockEntity,
                            total: 1000,
                            supplier,
                            is_aggregate,
                            aggregate_name,
                        },
                        supplierList,
                    }));
                });
            }

            function buildMockWorksheetGenerateCreditCardTable() {
                spreadsheetMock.workSheet.cell.mockImplementation((row, col) => {
                    if (row === 54 && col === 2) {
                        return { value: 'CREDIT_CARD(Nubank)', isMerged: true, _mergeCount: 14 } as any;
                    }

                    if (row === 56 && col === 2) {
                        return { value: 'Credit Card Nubank Ifood', isMerged: false, _mergeCount: 0 } as any;
                    }

                    if (row === 59 && col === 2) {
                        return { value: 'Credit Card Nubank Ifood', isMerged: true, _mergeCount: 14 } as any;
                    }

                    if (row === 61 && col === 2) {
                        return {
                            value: 'Credit Card Nubank IFood Andre Vinicios Pereira',
                            isMerged: false,
                            _mergeCount: 0
                        } as any;
                    }

                    if (row === 62 && col === 2) {
                        return { value: 'Credit Card Nubank IFood Google One', isMerged: false, _mergeCount: 0 } as any;
                    }

                    if (row === 63 && col === 2) {
                        return {
                            value: 'Credit Card Nubank IFood Xique Xique',
                            isMerged: false,
                            _mergeCount: 0
                        } as any;
                    }

                    if (row === 64 && col === 2) {
                        return {
                            value: 'Credit Card Nubank IFood IFood Clube',
                            isMerged: false,
                            _mergeCount: 0
                        } as any;
                    }

                    if (row === 65 && col === 2) {
                        return {
                            value: 'Credit Card Nubank IFood Anjos Restaurante',
                            isMerged: false,
                            _mergeCount: 0
                        } as any;
                    }

                    return { value: '', isMerged: false, _mergeCount: 0 } as any;
                });
            }

            xit('should correctly return a simple case (no parent/children).', () => {
                jest.spyOn(services, 'cleanTextByListText')
                    .mockImplementationOnce(() => 'Personal Expense 1');
                buildMockWorksheet([
                    {},
                    {},
                    { value: 'CREDIT_CARD(Nubank)' },
                    {},
                    { value: 'Expense 1' },
                    { value: 'TOTAL' },
                    {},
                ]);
                const startRow = 2;

                const result = business['generateCreditCardTable']({
                    bills: [mockBillEntity],
                    startRow,
                    groupName,
                    workSheet: spreadsheetMock.workSheet
                });
                expect(result.nextRow).toEqual(7);
                expect(result.data).toHaveLength(1);
                expect(result.data[0].january).toEqual(0);
                expect(result.data[0].january_paid).toBeFalsy();
                expect(result.data[0].name).toEqual('Personal Expense 1');
                expect(result.data[0].supplier).toEqual('Personal Expense 1');
                expect(result.data[0].aggregate_name).toEqual('');
                expect(result.data[0].is_aggregate).toBeFalsy();
                expect(result.data[0].paid).toBeFalsy();
                expect(result.data[0].total).toEqual(0);
            });

            xit('should ignore missing bills.', () => {
                buildMockWorksheet([
                    {},
                    {},
                    { value: 'CREDIT_CARD(Nubank)' },
                    { value: 'TOTAL' },
                ]);
                const startRow = 2;

                const result = business['generateCreditCardTable']({
                    bills: [],
                    startRow,
                    groupName,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result).toEqual({
                    data: [],
                    nextRow: 2 + 1
                });
            });

            xit('should return empty list if regex doesnt match.', () => {
                buildMockWorksheet([
                    {},
                    {},
                    { value: 'invalid' },
                    { value: 'TOTAL' },
                ]);
                const startRow = 2;

                const result = business['generateCreditCardTable']({
                    bills: [],
                    startRow,
                    groupName,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result).toEqual({
                    data: [],
                    nextRow: 2
                });
            });

            xit('should process parents and children correctly (isMerged = true, _mergeCount > 2).', () => {

                buildCreditCardBodyDataMock([
                    {
                        name: 'Personal Credit Card Nubank Ifood',
                        supplier: 'Ifood',
                        is_aggregate: false,
                        aggregate_name: '',
                        supplierList: ['Ifood']
                    },
                    {
                        name: 'Personal Credit Card Nubank IFood Andre Vinicios Pereira',
                        supplier: 'Andre Vinicios Pereira',
                        is_aggregate: true,
                        aggregate_name: 'IFood',
                    },
                    {
                        name: 'Personal Credit Card Nubank IFood Google One',
                        supplier: 'Google One',
                        is_aggregate: true,
                        aggregate_name: 'IFood',
                    },
                    {
                        name: 'Personal Credit Card Nubank IFood Xique Xique',
                        supplier: 'Xique Xique',
                        is_aggregate: true,
                        aggregate_name: 'IFood',
                    },
                    {
                        name: 'Personal Credit Card Nubank IFood IFood Clube',
                        supplier: 'Clube',
                        is_aggregate: true,
                        aggregate_name: 'IFood IFood',
                    },
                    {
                        name: 'Personal Credit Card Nubank IFood Anjos Restaurante',
                        supplier: 'Anjos Restaurante',
                        is_aggregate: true,
                        aggregate_name: 'IFood',
                    }
                ]);

                buildMockWorksheetGenerateCreditCardTable();

                const result = business['generateCreditCardTable']({
                    bills: [mockBillEntity],
                    startRow: 54,
                    groupName,
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result.nextRow).toEqual(67);
                expect(result.data).toHaveLength(1);
                expect(result.data[0].children).toHaveLength(5);
            });

            xit('should not add to acc when bodyData is false.', () => {
                jest.spyOn(business as any, 'buildCreditCardBodyData').mockImplementationOnce(() => ({
                    data: null,
                    supplierList: []
                }));

                buildMockWorksheetGenerateCreditCardTable();

                const result = business['generateCreditCardTable']({
                    bills: [mockBillEntity],
                    startRow: 54,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet
                });

                expect(result.data).toEqual([]);
            });

            xit('should set bankName to "Bank" when regex does not capture the name.', () => {
                const originalMatch = String.prototype.match;

                String.prototype.match = function(regex) {
                    if(this === 'CREDIT_CARD(Nubank)') {
                        return [
                            'CREDIT_CARD(Nubank)',
                            'CREDIT_CARD',
                            undefined,
                        ];
                    }
                    return originalMatch.call(this, regex);
                };

                jest.spyOn(business as any, 'buildCreditCardBodyData').mockImplementationOnce(() => ({
                    data: { name: 'Some Name' },
                    supplierList: []
                }));

                spreadsheetMock.workSheet.cell.mockImplementation((row, col) => {
                    if (row === 1) {
                        return { value: 'CREDIT_CARD(Nubank)', isMerged: false, _mergeCount: 1 } as any;
                    }
                    return { value: '', isMerged: false, _mergeCount: 1 } as any;
                });


                const result = business['generateCreditCardTable']({
                    bills: [mockBillEntity],
                    startRow: 1,
                    groupName: 'Personal',
                    workSheet: spreadsheetMock.workSheet
                });

                String.prototype.match = originalMatch;

                expect(result.data).toEqual([]);
            });

        });

    });
});