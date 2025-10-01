import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';

import { EMonth, MONTHS } from '@repo/services';

import { MonthEntity } from '../types';

import MonthBusiness from './business';

describe('Month Business', () => {
    let business: MonthBusiness;
    const mockMonth: MonthEntity = {
        id: 'a54df7b0-e28b-4d35-a658-edbb35fcb2d0',
        year: 2025,
        code: 1,
        paid: false,
        value: 100,
        label: 'january',
        income: undefined,
        expense: undefined,
        created_at: new Date('2025-04-02T19:11:59.405Z'),
        updated_at: new Date('2025-04-02T19:11:59.405Z'),
        deleted_at: undefined,
        received_at: new Date('2025-02-01T19:00:18.670Z'),
    }

    const mockMonthList: Array<MonthEntity> = [mockMonth];

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        jest.restoreAllMocks();
        business = new MonthBusiness();
    });

    afterEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
    });

    describe('generateMonthListUpdateParameters', () => {

        it('should generate month list update parameters undefined when dont received months', () => {
            const result = business.generateMonthListUpdateParameters();
            expect(result).toBeUndefined();
        });

        it('should generate month list update parameters undefined when received list of months empty', () => {
            const result = business.generateMonthListUpdateParameters([]);
            expect(result).toBeUndefined();
        });

        it('should generate month list update parameters undefined when received list of months with list of mothsToPersist undefined', () => {
            const result = business.generateMonthListUpdateParameters(mockMonthList);
            expect(result).toBeUndefined();
        });

        it('should generate month list update parameters undefined when received list of months with list of mothsToPersist empty', () => {
            const result = business.generateMonthListUpdateParameters(mockMonthList, []);
            expect(result).toBeUndefined();
        });

        it('should generate month list update parameters undefined when received list of months with list of mothsToPersist equals', () => {
            const result = business.generateMonthListUpdateParameters(mockMonthList, mockMonthList);
            expect(result).toBeUndefined();
        });

        it('should generate month list update parameters undefined when received list of months with list of mothsToPersist without code param', () => {
            const result = business.generateMonthListUpdateParameters(mockMonthList, mockMonthList.map((m) => ({ ...m, code: undefined })));
            expect(result).toBeUndefined();
        });

        it('should generate month list update parameters undefined when received list of months with list of mothsToPersist without code param and have month', () => {
            const result = business.generateMonthListUpdateParameters(mockMonthList, mockMonthList.map((m) => ({ ...m, code: undefined, month: EMonth.MAY })));
            expect(result).toBeUndefined();
        });

        it('should generate month list update parameters when received list of months different of list of mothsToPersist', () => {
            const expectedMonths =  mockMonthList.map((m) => ({ ...m, code: 2 }));
            const result = business.generateMonthListUpdateParameters(mockMonthList, expectedMonths);
            expect(result).toEqual(expectedMonths);
        });

        it('should generate month list update parameters when received list of months with value different of list of mothsToPersist', () => {
            const expectedMonths =  mockMonthList.map((m) => ({ ...m, value: 200 }));
            const result = business.generateMonthListUpdateParameters(mockMonthList, expectedMonths);
            expect(result).toEqual(expectedMonths);
        });

        it('should generate month list update parameters when received list of months with paid different of list of mothsToPersist', () => {
            const expectedMonths =  mockMonthList.map((m) => ({ ...m, paid: true }));
            const result = business.generateMonthListUpdateParameters(mockMonthList, expectedMonths);
            expect(result).toEqual(expectedMonths);
        });
    });

    describe('generatePersistMonthParams', () => {
        it('should generate persist month params with empty props. ', () => {
            const result = business.generatePersistMonthParams({});
            expect(result.id).toBeUndefined();
            expect(result.year).toBeUndefined();
            expect(result.code).toEqual(1);
            expect(result.paid).toBeUndefined();
            expect(result.value).toEqual(0);
            expect(result.month).toEqual(EMonth.JANUARY);
            expect(result.label).toBeUndefined();
            expect(result.income).toBeUndefined();
            expect(result.expense).toBeUndefined();
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
            expect(result.received_at.getFullYear()).toEqual(new Date().getFullYear());
        });

        it('should generate persist month params with all props. ', () => {
            const result = business.generatePersistMonthParams({
                year: 2025,
                paid: true,
                value: 200,
                month: EMonth.JULY,
                received_at: new Date('2025-07-01')
            });
            expect(result.id).toBeUndefined();
            expect(result.year).toEqual(2025);
            expect(result.code).toEqual(7);
            expect(result.paid).toBeTruthy();
            expect(result.value).toEqual(200);
            expect(result.month).toEqual(EMonth.JULY);
            expect(result.label).toBeUndefined();
            expect(result.income).toBeUndefined();
            expect(result.expense).toBeUndefined();
            expect(result.created_at).toBeUndefined();
            expect(result.updated_at).toBeUndefined();
            expect(result.deleted_at).toBeUndefined();
            expect(result.received_at).toEqual(new Date('2025-07-01'));
        })
    });

    describe('generatePersistListMonthParams', () => {
        it('should generate persist list month params with default props. ', () => {
            const result = business.generatePersistListMonthParams({});
            expect(result).toHaveLength(1);
            expect(result[0].id).toBeUndefined();
            expect(result[0].year).toBeUndefined();
            expect(result[0].code).toEqual(1);
            expect(result[0].paid).toBeUndefined();
            expect(result[0].value).toEqual(0);
            expect(result[0].month).toEqual(EMonth.JANUARY);
            expect(result[0].label).toBeUndefined();
            expect(result[0].income).toBeUndefined();
            expect(result[0].expense).toBeUndefined();
            expect(result[0].created_at).toBeUndefined();
            expect(result[0].updated_at).toBeUndefined();
            expect(result[0].deleted_at).toBeUndefined();
            expect(result[0].received_at.getFullYear()).toEqual(new Date().getFullYear());
        });

        it('should generate persist list month params with list of months empty. ', () => {
            const result = business.generatePersistListMonthParams({
                month: EMonth.JANUARY,
                months: []
            });
            expect(result).toHaveLength(1);
        });

        it('should generate persist list month params with list of months with only value. ', () => {
            const result = business.generatePersistListMonthParams({
                months: [{ value: 10 }, { value: 20 }, { value: 30 }]
            });
            expect(result).toHaveLength(3);
        });

        it('should generate persist list month params with list of months with value and month. ', () => {
            const result = business.generatePersistListMonthParams({
                months: [{ month: EMonth.JULY, value: 70 }]
            });
            expect(result).toHaveLength(1);
            expect(result[0].code).toEqual(7);
            expect(result[0].value).toEqual(70);
            expect(result[0].month).toEqual(EMonth.JULY);
        });

        it('should generate persist list month params with list of months with value and label. ', () => {
            const result = business.generatePersistListMonthParams({
                months: [{ label: 'may', value: 50 }]
            });
            expect(result).toHaveLength(1);
            expect(result[0].code).toEqual(5);
            expect(result[0].value).toEqual(50);
            expect(result[0].month).toEqual(EMonth.MAY);
        });
    });

    describe('generateMonthListCreationParameters', () => {
        it('should generate month list creation parameters successfully with default props.', () => {
            const result = business.generateMonthListCreationParameters({ });
            expect(result).toHaveLength(MONTHS.length);

            MONTHS.forEach((month, index) => {
                const persistMonthParams = result.find(param => param.code === index + 1);
                expect(persistMonthParams.id).toBeUndefined();
                expect(persistMonthParams.year).toBeUndefined();
                expect(persistMonthParams.code).toEqual(index + 1);
                expect(persistMonthParams.paid).toBeUndefined();
                expect(persistMonthParams.value).toEqual(0);
                expect(persistMonthParams.month).toEqual(month.toUpperCase());
                expect(persistMonthParams.label).toBeUndefined();
                expect(persistMonthParams.income).toBeUndefined();
                expect(persistMonthParams.expense).toBeUndefined();
                expect(persistMonthParams.created_at).toBeUndefined();
                expect(persistMonthParams.updated_at).toBeUndefined();
                expect(persistMonthParams.deleted_at).toBeUndefined();
                expect(persistMonthParams.received_at.getFullYear()).toEqual(new Date().getFullYear());
            });
        });

        it('should generate month list creation parameters successfully with list of months with complete object.', () => {
            const result = business.generateMonthListCreationParameters({
                year: 2025,
                months: [{
                    paid: true,
                    year: 2025,
                    code: 1,
                    value: 100,
                    label: 'january',
                    month: EMonth.JANUARY,
                    received_at: new Date('2027-01-01')
                }],
            });

            expect(result).toHaveLength(MONTHS.length);

            MONTHS.forEach((month, index) => {
                const persistMonthParams = result.find(param => param.code === (index + 1));
                expect(persistMonthParams.id).toBeUndefined();
                expect(persistMonthParams.year).toEqual(2025);
                expect(persistMonthParams.code).toEqual(index + 1);
                expect(persistMonthParams.paid).toEqual(month === 'january' ? true : undefined);
                expect(persistMonthParams.value).toEqual(month === 'january' ? 100 : 0);
                expect(persistMonthParams.month).toEqual(month.toUpperCase());
                expect(persistMonthParams.label).toEqual(month === 'january' ? 'january' : undefined);
                expect(persistMonthParams.expense).toBeUndefined();
                expect(persistMonthParams.created_at).toBeUndefined();
                expect(persistMonthParams.updated_at).toBeUndefined();
                expect(persistMonthParams.deleted_at).toBeUndefined();
                expect(persistMonthParams.received_at.getFullYear()).toEqual(month === 'january' ? 2026 : 2025);
            });
        });

        it('should generate month list creation parameters successfully with list of months empty.', () => {
            const result = business.generateMonthListCreationParameters({
                year: 2025,
                paid: true,
                value: 100,
                month: EMonth.JANUARY,
                received_at: new Date('2027-01-01')
            });

            expect(result).toHaveLength(MONTHS.length);

            MONTHS.forEach((month, index) => {
                const persistMonthParams = result.find(param => param.code === (index + 1));
                expect(persistMonthParams.id).toBeUndefined();
                expect(persistMonthParams.year).toEqual(2025);
                expect(persistMonthParams.code).toEqual(index + 1);
                expect(persistMonthParams.paid).toBeTruthy();
                expect(persistMonthParams.value).toEqual(month === 'january' ? 100 : 0);
                expect(persistMonthParams.month).toEqual(month.toUpperCase());
                expect(persistMonthParams.label).toBeUndefined();
                expect(persistMonthParams.expense).toBeUndefined();
                expect(persistMonthParams.created_at).toBeUndefined();
                expect(persistMonthParams.updated_at).toBeUndefined();
                expect(persistMonthParams.deleted_at).toBeUndefined();
                expect(persistMonthParams.received_at.getFullYear()).toEqual(2026);
            });
        });
    })
})