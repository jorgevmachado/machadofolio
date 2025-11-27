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
        splitMonthsByInstalment: jest.fn(),
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
const mockGeneratePersistMonthParams = jest.fn();
const mockGenerateMonthListCreationParameters = jest.fn();

jest.mock('../../month', () => {
    class MonthBusinessMock {
        calculateAll = mockCalculateAll;
        totalByMonth = mockTotalByMonth;
        calculateByMonth = mockCalculateByMonth;
        convertMonthsToObject = mockConvertMonthsToObject;
        generatePersistMonthParams = mockGeneratePersistMonthParams;
        generateMonthListCreationParameters = mockGenerateMonthListCreationParameters;
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

    describe('allHaveBeenPaid', () => {
        it('should return false when dont receive a list of expenses.', () => {
            expect(business.allHaveBeenPaid([])).toBeFalsy();
        });

        it('should return false when receive a list of expenses with all not paid.', () => {
            expect(business.allHaveBeenPaid([{...mockEntity, paid: false }])).toBeFalsy();
        });

        it('should return true when receive a list of expenses with all paid.', () => {
            expect(business.allHaveBeenPaid([{...mockEntity, paid: true }])).toBeTruthy();
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

    describe('calculate', () => {
        it('should calculate correctly for a fixed expense without months', () => {
            mockCalculateAll.mockReturnValue({ total: 0, allPaid: false, totalPaid: 0, totalPending: 0 });
            const expenseFixed: ExpenseEntity = {
                ...mockEntity,
                id: undefined,
                year: 2025,
                name: mockEntity.name,
                type: 'FIXED' as ExpenseEntity['type'],
                paid: false,
                total: 0,
                months: undefined,
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
            expect(result.total).toEqual(0);
            expect(result.total_paid).toEqual(0);
        });

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

    describe('monthsMapper', () => {
        it('should return a list of months by list of expenses.', () => {
            const mockExpenses = [
                mockEntity,
                {...mockEntity, parent: mockEntity },
                {...mockEntity, children: [ mockEntity ] },
            ];

            const result = business.monthsMapper(mockExpenses);
            expect(result).toHaveLength(4);
        });

        it('should return a list empty when received a list of expenses empty.', () => {
            const result = business.monthsMapper([]);
            expect(result).toHaveLength(0);
        });

        it('should return a list of months by list of expenses when expenses has a undefined months.', () => {
            const mockExpenses = [
                { ...mockEntity, months: undefined },
                {...mockEntity, parent: mockEntity },
                {...mockEntity, children: [ { ...mockEntity, months: undefined } ] },
            ];

            const result = business.monthsMapper(mockExpenses);
            expect(result).toHaveLength(2);
        });
    });

    describe('prepareForCreation', () => {
        it('must return an expense when receiving the array of months in size 12.', () => {
            const result = business.prepareForCreation({
                months: mockMonths,
                expense: mockEntity,
            });

            expect(result.nextYear).toEqual(2026);
            expect(result.requiresNewBill).toBeFalsy();
            expect(result.monthsForNextYear).toHaveLength(0);
            expect(result.expenseForNextYear).toBeUndefined();
            expect(result.monthsForCurrentYear).toHaveLength(12);
            expect(result.instalmentForNextYear).toEqual(0);
        });

        it('must return an expense when receiving the array of months in a size other than 12.', () => {
            mockGenerateMonthListCreationParameters.mockReturnValue(mockMonths);
            const result = business.prepareForCreation({
                months: [mockMonthEntity],
                expense: mockEntity,
            });

            expect(result.nextYear).toEqual(2026);
            expect(result.requiresNewBill).toBeFalsy();
            expect(result.monthsForNextYear).toHaveLength(0);
            expect(result.expenseForNextYear).toBeUndefined();
            expect(result.monthsForCurrentYear).toHaveLength(12);
            expect(result.instalmentForNextYear).toEqual(0);
        });

        it('Should return a expense with type FIXED', () => {
            mockGenerateMonthListCreationParameters.mockReturnValue(mockMonths.map((item) => ({ ...item, value: 100 })));
            const result = business.prepareForCreation({
                value: 100,
                expense: { ...mockEntity, type: 'FIXED' as ExpenseEntity['type'] },
            });

            expect(result.nextYear).toEqual(2026);
            expect(result.requiresNewBill).toBeFalsy();
            expect(result.monthsForNextYear).toHaveLength(0);
            expect(result.expenseForNextYear).toBeUndefined();
            expect(result.monthsForCurrentYear).toHaveLength(12);
            expect(result.instalmentForNextYear).toEqual(0);
        });

        it('should return a expense with type VARIABLE and expense for next year.', () => {

            jest.spyOn(services, 'splitMonthsByInstalment').mockReturnValue({
                monthsForNextYear: [EMonth.JANUARY],
                monthsForCurrentYear: [
                    EMonth.FEBRUARY,
                    EMonth.MARCH,
                    EMonth.APRIL,
                    EMonth.MAY,
                    EMonth.JUNE,
                    EMonth.JULY,
                    EMonth.AUGUST,
                    EMonth.SEPTEMBER,
                    EMonth.OCTOBER,
                    EMonth.NOVEMBER,
                    EMonth.DECEMBER,
                ]
            });

            mockGeneratePersistMonthParams.mockImplementation((params) => {
                const month = mockMonths.find((m) => m.label === params['month'].toLowerCase());
                return {
                    ...month,
                    year: params['year'],
                    value: params['value'],
                    expense: undefined,
                }
            });

            mockGenerateMonthListCreationParameters.mockImplementation((params) => mockMonths.map((item) => {
                const result = {
                    ...item,
                    year: params['year'],
                    value: 0
                };
                if(params['year'] === 2025) {
                    result.value = params['value'];
                }
                if(params['year'] === 2026 && item.label === 'january') {
                    result.value = params['value'];
                }

                return result;
            }));

            const result = business.prepareForCreation({
                value: 100,
                month: EMonth.FEBRUARY,
                expense: { ...mockEntity, instalment_number: 12 },
            });

            expect(result.nextYear).toEqual(2026);
            expect(result.requiresNewBill).toBeTruthy();
            expect(result.monthsForNextYear).toHaveLength(12);
            expect(result.monthsForNextYear[0].value).toEqual(100);
            expect(result.monthsForNextYear[1].value).toEqual(0);
            expect(result.monthsForCurrentYear).toHaveLength(12);
            expect(result.instalmentForNextYear).toEqual(1);
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