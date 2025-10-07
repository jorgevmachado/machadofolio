import { SpreadsheetBusiness } from './spreadsheet';
import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import * as services from '@repo/services';
import { EMonth, MONTHS } from '@repo/services';

import { EXPENSE_MOCK, EXPENSE_MONTH_MOCK } from '../../mock';

import { ExpenseEntity } from '../types';

import ExpenseBusiness from './business';
import { MonthsObject } from '../../month';

jest.mock('@repo/services', () => {
    const originalModule = jest.requireActual('@repo/services');
    return {
        ...((typeof originalModule === 'object' && originalModule !== null) ? originalModule : {}),
        getCurrentMonth: jest.fn(),
    };
});

jest.mock('../expense', () => {
    class ExpenseMock {}
    return { Expense: ExpenseMock };
});

const mockCalculateAll = jest.fn();
const mockConvertMonthsToObject = jest.fn();
const mockCalculateByMonth = jest.fn();
const mockTotalByMonth = jest.fn();

jest.mock('../../month', () => {
    class MonthBusinessMock {
        calculateAll = mockCalculateAll;
        totalByMonth = mockTotalByMonth;
        calculateByMonth = mockCalculateByMonth;
        convertMonthsToObject = mockConvertMonthsToObject;
    }

    return { MonthBusiness: MonthBusinessMock }
});

jest.mock('./spreadsheet', () => {
    class SpreadsheetBusinessMock {
    }

    return { SpreadsheetBusiness: SpreadsheetBusinessMock }
});

describe('Expense Business', () => {
    let business: ExpenseBusiness;
    const mockEntity: ExpenseEntity = EXPENSE_MOCK as unknown as ExpenseEntity;
    const mockMonthEntity: ExpenseEntity['months'][number] = EXPENSE_MONTH_MOCK as unknown as ExpenseEntity['months'][number];
    const mockMonths: ExpenseEntity['months'] = MONTHS.map((month, index) => ({
        ...mockMonthEntity,
        code: index + 1,
        value: 100 * (index + 1),
        label: month,
    }));
    const mockMonthObject: MonthsObject = {
        january: 0,
        january_paid: false,
        february: 0,
        february_paid: false,
        march: 0,
        march_paid: false,
        april: 0,
        april_paid: false,
        may: 0,
        may_paid: false,
        june: 0,
        june_paid: false,
        july: 0,
        july_paid: false,
        august: 0,
        august_paid: false,
        september: 0,
        september_paid: false,
        october: 0,
        october_paid: false,
        november: 0,
        november_paid: false,
        december: 0,
        december_paid: false,
    }

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        jest.resetModules();
        business = new ExpenseBusiness();
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    describe('SpreadsheetBusiness Module', () => {
        it('should return the instance of SpreadsheetBusiness via spreadsheet getter', () => {
            expect(business.spreadsheet).toBeInstanceOf(SpreadsheetBusiness);
        });
    });

    describe('initialize', () => {
        it('should initialize a FIXED expense correctly', () => {
            const year = 2025;
            const type = 'FIXED' as ExpenseEntity['type'];
            const instalment_number = 12;
            const expenseFixed: ExpenseEntity = {
                ...mockEntity,
                id: undefined,
                year,
                paid: true,
                name: `${mockEntity.bill.name} ${mockEntity.supplier.name}`,
                type,
                months: [],
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


            const result = business.initialize(expenseFixed);

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
            expect(result.expenseForCurrentYear.description).toBeUndefined();
            expect(result.expenseForCurrentYear.created_at).toBeUndefined();
            expect(result.expenseForCurrentYear.updated_at).toBeUndefined();
            expect(result.expenseForCurrentYear.deleted_at).toBeUndefined();
            expect(result.expenseForCurrentYear.instalment_number).toEqual(12);
        });

        it('should initialize a variable expense correctly with instalment_number equal 2', () => {
            jest.spyOn(services, 'getCurrentMonth').mockReturnValue(EMonth.JANUARY);

            const year = 2025;
            const type = 'VARIABLE' as ExpenseEntity['type'];
            const instalment_number = 2;
            const expenseVariableInstalmentNumber: ExpenseEntity = {
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

            const result = business.initialize(expenseVariableInstalmentNumber);

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
            expect(result.expenseForCurrentYear.description).toBeUndefined();
            expect(result.expenseForCurrentYear.created_at).toBeUndefined();
            expect(result.expenseForCurrentYear.updated_at).toBeUndefined();
            expect(result.expenseForCurrentYear.deleted_at).toBeUndefined();
            expect(result.expenseForCurrentYear.instalment_number).toEqual(2);
        });

        it('should initialize a variable expense correctly with instalment_number equal 12 and expenseForNextYear', () => {
            const year = 2025;
            const month = EMonth.MARCH;
            const instalment_number = 12;
            const expenseVariableWithNextYear: ExpenseEntity = {
                ...mockEntity,
                id: undefined,
                year,
                bill: mockEntity.bill,
                name: `${mockEntity.bill.name} ${mockEntity.supplier.name}`,
                type: 'VARIABLE' as ExpenseEntity['type'],
                paid: false,
                total: 0,
                supplier: mockEntity.supplier,
                total_paid: 0,
                created_at: undefined,
                updated_at: undefined,
                description: undefined,
                instalment_number,
            };

            const result = business.initialize(expenseVariableWithNextYear, month);

            expect(result.nextYear).toBe(2026);
            expect(result.requiresNewBill).toBeTruthy();
            expect(result.expenseForCurrentYear.id).toBeUndefined();
            expect(result.expenseForCurrentYear.name).toEqual(expenseVariableWithNextYear.name);
            expect(result.expenseForCurrentYear.year).toEqual(expenseVariableWithNextYear.year);
            expect(result.expenseForCurrentYear.bill).toEqual(expenseVariableWithNextYear.bill);
            expect(result.expenseForCurrentYear.type).toEqual('VARIABLE');
            expect(result.expenseForCurrentYear.paid).toBeFalsy();
            expect(result.expenseForCurrentYear.total).toEqual(0);
            expect(result.expenseForCurrentYear.supplier).toEqual(
                expenseVariableWithNextYear.supplier,
            );
            expect(result.expenseForCurrentYear.name_code).toEqual(
                expenseVariableWithNextYear.name_code,
            );
            expect(result.expenseForCurrentYear.total_paid).toEqual(0);
            expect(result.expenseForCurrentYear.description).toBeUndefined();
            expect(result.expenseForCurrentYear.created_at).toBeUndefined();
            expect(result.expenseForCurrentYear.updated_at).toBeUndefined();
            expect(result.expenseForCurrentYear.deleted_at).toBeUndefined();
            expect(result.expenseForCurrentYear.instalment_number).toEqual(10);

            expect(result.expenseForNextYear?.id).toEqual('');
            expect(result.expenseForNextYear?.name).toEqual(expenseVariableWithNextYear.name);
            expect(result.expenseForNextYear?.year).toEqual(2026);
            expect(result.expenseForNextYear?.type).toEqual('VARIABLE');
            expect(result.expenseForNextYear?.paid).toBeFalsy();
            expect(result.expenseForNextYear?.total).toEqual(0);
            expect(result.expenseForNextYear?.supplier).toEqual(
                expenseVariableWithNextYear.supplier,
            );
            expect(result.expenseForNextYear?.name_code).toEqual(
                expenseVariableWithNextYear.name_code,
            );
            expect(result.expenseForNextYear?.total_paid).toEqual(0);
            expect(result.expenseForNextYear?.description).toBeUndefined();
            expect(result.expenseForNextYear?.created_at).toBeUndefined();
            expect(result.expenseForNextYear?.updated_at).toBeUndefined();
            expect(result.expenseForNextYear?.deleted_at).toBeUndefined();
            expect(result.expenseForNextYear?.instalment_number).toEqual(2);
        });
    });

    describe('totalByMonth', () => {
        it('Should add the value of each month between expenses', () => {
            mockTotalByMonth.mockReturnValue(100);
            const sumJanuary = business.totalByMonth('january', [mockEntity]);
            expect(sumJanuary).toBe(100);

            mockTotalByMonth.mockReturnValue(0);
            const sumFebruary = business.totalByMonth('february', [mockEntity]);
            expect(sumFebruary).toBe(0);

            mockTotalByMonth.mockReturnValue(0);
            const sumMarch = business.totalByMonth('march', [mockEntity]);
            expect(sumMarch).toBe(0);
        });
    });

    describe('calculateAll', () => {
        it('should return 0 and true in all values when the expense list is empty.', () => {
            const result = business.calculateAll([]);
            expect(result.total).toEqual(0);
            expect(result.allPaid).toBeTruthy();
            expect(result.totalPaid).toEqual(0);
            expect(result.totalPending).toEqual(0);
        });

        it('should calculated all and return correctly values.', () => {
            jest.spyOn(business, 'calculate').mockReturnValue({
                ...mockEntity,
                paid: false,
                total: 100,
                total_paid: 0,
                total_pending: 100
            });
            const result = business.calculateAll([mockEntity, mockEntity, mockEntity, mockEntity]);
            expect(result.total).toEqual(400);
            expect(result.allPaid).toBeFalsy();
            expect(result.totalPaid).toEqual(0);
            expect(result.totalPending).toEqual(400);
        });

        it('should calculated all and return correctly values with all paid.', () => {
            jest.spyOn(business, 'calculate').mockReturnValue({
                ...mockEntity,
                paid: true,
                total: 100,
                total_paid: 100,
                total_pending: 0
            });
            const result = business.calculateAll([
                { ...mockEntity, months: mockEntity.months.map((month) => ({ ...month, paid: true })) },
                { ...mockEntity, months: mockEntity.months.map((month) => ({ ...month, paid: true })) },
                { ...mockEntity, months: mockEntity.months.map((month) => ({ ...month, paid: true })) },
                { ...mockEntity, months: mockEntity.months.map((month) => ({ ...month, paid: true })) },
            ]);
            expect(result.total).toEqual(400);
            expect(result.allPaid).toBeTruthy();
            expect(result.totalPaid).toEqual(400);
            expect(result.totalPending).toEqual(0);
        });

        it('should calculated all and return correctly values with all not paid.', () => {
            jest.spyOn(business, 'calculate').mockReturnValue({
                ...mockEntity,
                paid: false,
                total: 100,
                total_paid: 0,
                total_pending: 100
            });
            const result = business.calculateAll([
                { ...mockEntity, months: mockEntity.months.map((month) => ({ ...month, paid: false })) },
                { ...mockEntity, months: mockEntity.months.map((month) => ({ ...month, paid: false })) },
                { ...mockEntity, months: mockEntity.months.map((month) => ({ ...month, paid: false })) },
                { ...mockEntity, months: mockEntity.months.map((month) => ({ ...month, paid: false })) },
            ]);
            expect(result.total).toEqual(400);
            expect(result.allPaid).toBeFalsy();
            expect(result.totalPaid).toEqual(0);
            expect(result.totalPending).toEqual(400);
        });

        it('should calculated all expense parent with children and return correctly values.', () => {
            const mockChild = {...mockEntity, months: mockMonths };
            const mockChildren = [
                mockChild,
                mockChild,
                mockChild,
                mockChild
            ]
            const expense = {
                ...mockEntity,
                children: mockChildren
            }
            jest.spyOn(business, 'calculateParent' as any).mockReturnValue({
                ...expense,
                months: mockMonths.map((month) => ({ ...month, value: 400 })),
            });
            jest.spyOn(business, 'calculate').mockReturnValue({
                ...mockEntity,
                paid: false,
                total: 19200,
                total_paid: 0,
                total_pending: 19200
            });
            const result = business.calculateAll([expense, expense, expense, expense]);
            expect(result.total).toEqual(76800);
            expect(result.allPaid).toBeFalsy();
            expect(result.totalPaid).toEqual(0);
            expect(result.totalPending).toEqual(76800);
        });
    });

    describe('reinitialize', () => {
        const mock = { ...mockEntity };
        const expense: ExpenseEntity = {
            ...mock,
            id: undefined,
            paid: true,
            type: 'VARIABLE' as ExpenseEntity['type'],
            total: 0,
            months: mock.months.map((month) => ({ ...month, paid: true, value: 50 })),
            total_paid: 0,
            instalment_number: 2,
        };

        const existingExpense: ExpenseEntity = {
            ...mock,
            paid: true,
            total: 0,
            months: mock.months.map((month) => ({ ...month, paid: true, value: 50 })),
            total_paid: 0,
        };

        it('should return a expense when existingExpense is undefined', () => {
            const result = business.reinitialize([], expense);
            expect(result.id).toBeUndefined();
            expect(result.name).toEqual(expense.name);
            expect(result.year).toEqual(expense.year);
            expect(result.bill).toEqual(expense.bill);
            expect(result.type).toEqual(expense.type);
            expect(result.paid).toBeTruthy();
            expect(result.total).toEqual(0);
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
            expect(result.paid).toBeTruthy();
            expect(result.total).toEqual(0);
            expect(result.months[0].value).toEqual(100);
            expect(result.supplier).toEqual(existingExpense.supplier);
            expect(result.name_code).toEqual(existingExpense.name_code);
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

    describe('calculate', () => {
        it('should calculate correctly for a fixed expense', () => {
            mockCalculateAll.mockReturnValue({ total: 100, allPaid: false, totalPaid: 0, totalPending: 0 });
            const expenseFixed: ExpenseEntity = {
                ...mockEntity,
                id: undefined,
                year: 2025,
                name: mockEntity.name,
                type: 'FIXED' as ExpenseEntity['type'],
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

            const result = business.calculate(expenseFixed);
            expect(result.paid).toBeFalsy();
            expect(result.total).toEqual(100);
            expect(result.total_paid).toEqual(0);
        });

        it('should calculate correctly for a variable expense', () => {
            mockCalculateAll.mockReturnValue({ total: 187.18, allPaid: true, totalPaid: 187.18, totalPending: 0 });
            const expenseVariable: ExpenseEntity = {
                ...mockEntity,
                id: undefined,
                year: 2025,
                name: mockEntity.name,
                type: 'VARIABLE' as ExpenseEntity['type'],
                paid: false,
                total: 0,
                months: [{
                    ...mockEntity.months[0],
                    paid: true,
                    value: 187.18
                }],
                supplier: mockEntity.supplier,
                total_paid: 0,
                description: undefined,
                created_at: undefined,
                updated_at: undefined,
                deleted_at: undefined,
                instalment_number: 2,
            };

            const result = business.calculate(expenseVariable);
            expect(result.paid).toBeTruthy();
            expect(result.total).toEqual(187.18);
            expect(result.total_paid).toEqual(187.18);
        });

        it('should calculate correctly with children', () => {
            jest.spyOn(business, 'calculateParent' as any).mockReturnValue(mockEntity);
            mockCalculateAll.mockReturnValue({ total: 187.18, allPaid: true, totalPaid: 187.18, totalPending: 0 });
            const expenseVariable: ExpenseEntity = {
                ...mockEntity,
                id: undefined,
                year: 2025,
                name: mockEntity.name,
                type: 'VARIABLE' as ExpenseEntity['type'],
                paid: false,
                total: 0,
                months: [{
                    ...mockEntity.months[0],
                    paid: true,
                    value: 187.18
                }],
                parent: undefined,
                children: [mockEntity],
                supplier: mockEntity.supplier,
                total_paid: 0,
                description: undefined,
                created_at: undefined,
                updated_at: undefined,
                deleted_at: undefined,
                instalment_number: 2,
            };

            const result = business.calculate(expenseVariable);
            expect(result.paid).toBeTruthy();
            expect(result.total).toEqual(187.18);
            expect(result.total_paid).toEqual(187.18);
        });
    });

    describe('convertMonthsToObject', () => {
        it('should return an object with the months correctly', () => {
            mockConvertMonthsToObject.mockReturnValue({
                ...mockMonthObject,
                january: 100
            })
            const result = business.convertMonthsToObject(mockEntity);
            expect(result.january).toEqual(100);
            expect(result.january_paid).toBeFalsy();
            expect(result.february).toEqual(0);
            expect(result.february_paid).toBeFalsy();
            expect(result.march).toEqual(0);
            expect(result.march_paid).toBeFalsy();
            expect(result.april).toEqual(0);
            expect(result.april_paid).toBeFalsy();
            expect(result.may).toEqual(0);
            expect(result.may_paid).toBeFalsy();
            expect(result.june).toEqual(0);
            expect(result.june_paid).toBeFalsy();
            expect(result.july).toEqual(0);
            expect(result.july_paid).toBeFalsy();
            expect(result.august).toEqual(0);
            expect(result.august_paid).toBeFalsy();
            expect(result.september).toEqual(0);
            expect(result.september_paid).toBeFalsy();
            expect(result.october).toEqual(0);
            expect(result.october_paid).toBeFalsy();
            expect(result.november).toEqual(0);
            expect(result.november_paid).toBeFalsy();
            expect(result.december).toEqual(0);
            expect(result.december_paid).toBeFalsy();
            expect(result.parent).toBeUndefined();
            expect(result.children).toBeUndefined();
        });

        it('should return an object with parent and months correctly', () => {
            mockConvertMonthsToObject.mockReturnValue({
                ...mockMonthObject,
                january: 100
            }).mockReturnValue({
                ...mockMonthObject,
                january: 100
            });
            const result = business.convertMonthsToObject({
                ...mockEntity,
                parent: mockEntity,
                children: [],
            });
            expect(result.january).toEqual(100);
            expect(result.january_paid).toBeFalsy();
            expect(result.february).toEqual(0);
            expect(result.february_paid).toBeFalsy();
            expect(result.march).toEqual(0);
            expect(result.march_paid).toBeFalsy();
            expect(result.april).toEqual(0);
            expect(result.april_paid).toBeFalsy();
            expect(result.may).toEqual(0);
            expect(result.may_paid).toBeFalsy();
            expect(result.june).toEqual(0);
            expect(result.june_paid).toBeFalsy();
            expect(result.july).toEqual(0);
            expect(result.july_paid).toBeFalsy();
            expect(result.august).toEqual(0);
            expect(result.august_paid).toBeFalsy();
            expect(result.september).toEqual(0);
            expect(result.september_paid).toBeFalsy();
            expect(result.october).toEqual(0);
            expect(result.october_paid).toBeFalsy();
            expect(result.november).toEqual(0);
            expect(result.november_paid).toBeFalsy();
            expect(result.december).toEqual(0);
            expect(result.december_paid).toBeFalsy();
            expect(result.parent.january).toEqual(100);
            expect(result.parent.january_paid).toBeFalsy();
            expect(result.children).toBeUndefined();
        });

        it('should return an object with children and months correctly', () => {
            mockConvertMonthsToObject.mockReturnValue({
                ...mockMonthObject,
                january: 100
            }).mockReturnValue({
                ...mockMonthObject,
                january: 100
            });
            const result = business.convertMonthsToObject({
                ...mockEntity,
                parent: undefined,
                children: [mockEntity],
            });
            expect(result.january).toEqual(100);
            expect(result.january_paid).toBeFalsy();
            expect(result.february).toEqual(0);
            expect(result.february_paid).toBeFalsy();
            expect(result.march).toEqual(0);
            expect(result.march_paid).toBeFalsy();
            expect(result.april).toEqual(0);
            expect(result.april_paid).toBeFalsy();
            expect(result.may).toEqual(0);
            expect(result.may_paid).toBeFalsy();
            expect(result.june).toEqual(0);
            expect(result.june_paid).toBeFalsy();
            expect(result.july).toEqual(0);
            expect(result.july_paid).toBeFalsy();
            expect(result.august).toEqual(0);
            expect(result.august_paid).toBeFalsy();
            expect(result.september).toEqual(0);
            expect(result.september_paid).toBeFalsy();
            expect(result.october).toEqual(0);
            expect(result.october_paid).toBeFalsy();
            expect(result.november).toEqual(0);
            expect(result.november_paid).toBeFalsy();
            expect(result.december).toEqual(0);
            expect(result.december_paid).toBeFalsy();
            expect(result.parent).toBeUndefined();
            expect(result.children[0].january).toEqual(100);
            expect(result.children[0].january_paid).toBeFalsy();
        });
    });

    describe('private', () => {
        describe('splitMonthsByYear', () => {
            it('should return months correctly', () => {
                const result = business['splitMonthsByYear'](
                    2025,
                    2,
                    0
                );
                expect(result.monthsForCurrentYear).toEqual(['january', 'february']);
                expect(result.monthsForNextYear).toHaveLength(0);
            })

            it('should return months correctly with monthsForNextYear ', () => {
                const result = business['splitMonthsByYear'](
                    2025,
                    12,
                    1
                );
                expect(result.monthsForCurrentYear).toHaveLength(11);
                expect(result.monthsForNextYear).toEqual(['january']);
            })
        });

        describe('calculateChildren', () => {
            it('should calculate children correctly', () => {
                mockCalculateByMonth.mockReturnValue(mockMonthEntity);
                const result = business['calculateChildren']([mockEntity], mockMonthEntity);
                expect(result).toEqual(mockMonthEntity);
            });
        });

        describe('calculateParent', () => {
            it('should return entity when dont have children', () => {
                const result = business['calculateParent'](mockEntity);
                expect(result).toEqual(mockEntity);
            })

            it('should calculate parent correctly', () => {
                const mockChild = {...mockEntity, months: mockMonths };
                const mockChildren = [
                    mockChild,
                    mockChild,
                    mockChild,
                    mockChild
                ]
                const expense = {
                    ...mockEntity,
                    months: mockMonths.map((m) => ({...m, value: 0 })),
                    children: mockChildren
                }
                jest.spyOn(business, 'calculate').mockReturnValue(mockChild);
                jest.spyOn(business, 'calculateChildren' as any).mockReturnValue({ ...mockMonthEntity, value: 400});
                const result = business['calculateParent'](expense);
                result.months.forEach((m) => {
                    expect(m.value).toEqual(400);
                })

            })
        })
    });
});