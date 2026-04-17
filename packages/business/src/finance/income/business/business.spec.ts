import { afterEach, beforeEach, describe, expect, it, jest, } from '@jest/globals';
import IncomeBusiness from './business';
import { IncomeEntity } from '../types';
import { INCOME_MOCK } from '../../mock';
import { ExpenseEntity } from '../../expense';
import { MONTHS } from '@repo/services';
import { MonthsObject } from '../../month';

const mockCalculateAll = jest.fn();
const mockConvertMonthsToObject = jest.fn();

jest.mock('../../month', () => {
  class MonthBusinessMock {
    calculateAll = mockCalculateAll;
    convertMonthsToObject = mockConvertMonthsToObject;
  }

  return { MonthBusiness: MonthBusinessMock }
});

describe('Income Business', () => {
  let business: IncomeBusiness;
  const mockEntity: IncomeEntity = INCOME_MOCK as unknown as IncomeEntity;
  const mockMonthEntity: IncomeEntity['months'][0] = mockEntity.months[0];
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
    business = new IncomeBusiness();
  });

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('calculate', () => {
    it('should return the correct values when the income is fixed', () => {
      mockCalculateAll.mockReturnValue({ total: 100, allPaid: false, totalPaid: 0, totalPending: 0 });
      const result = business.calculate(mockEntity);
      expect(result.total).toEqual(100);
      expect(result.all_paid).toBeFalsy();
    });

    it('should return the correct values when the income is variable', () => {
      mockCalculateAll.mockReturnValue({ total: 100, allPaid: false, totalPaid: 0, totalPending: 0 });
      const result = business.calculate({...mockEntity, months: mockMonths });
      expect(result.total).toEqual(100);
      expect(result.all_paid).toBeFalsy();
    });

    it('should return the correct values when the income is variable and all paid', () => {
      mockCalculateAll.mockReturnValue({ total: 100, allPaid: true, totalPaid: 100, totalPending: 0 });
      const result = business.calculate({...mockEntity, months: mockMonths });
      expect(result.total).toEqual(100);
      expect(result.all_paid).toBeTruthy();
    })
  });

  describe('convertMonthsToObject', () => {
    it('should return an object with the months correctly', () => {
      mockConvertMonthsToObject.mockReturnValue({
        ...mockMonthObject,
        january: 100
      });
      mockCalculateAll.mockReturnValue({ total: 100, allPaid: false, totalPaid: 0, totalPending: 0 });
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
      expect(result.total).toEqual(100);
    });
  });

  describe('convertMonthsToArray', () => {
    it('should return an object with the months correctly', () => {
      mockConvertMonthsToObject.mockReturnValue({
        ...mockMonthObject,
        january: 100
      });
      mockCalculateAll.mockReturnValue({ total: 100, allPaid: false, totalPaid: 0, totalPending: 0 });
      const result = business.convertMonthsToArray(mockEntity);
      const currentResult = result[0];
      expect(currentResult.january).toEqual(100);
      expect(currentResult.january_paid).toBeFalsy();
      expect(currentResult.february).toEqual(0);
      expect(currentResult.february_paid).toBeFalsy();
      expect(currentResult.march).toEqual(0);
      expect(currentResult.march_paid).toBeFalsy();
      expect(currentResult.april).toEqual(0);
      expect(currentResult.april_paid).toBeFalsy();
      expect(currentResult.may).toEqual(0);
      expect(currentResult.may_paid).toBeFalsy();
      expect(currentResult.june).toEqual(0);
      expect(currentResult.june_paid).toBeFalsy();
      expect(currentResult.july).toEqual(0);
      expect(currentResult.july_paid).toBeFalsy();
      expect(currentResult.august).toEqual(0);
      expect(currentResult.august_paid).toBeFalsy();
      expect(currentResult.september).toEqual(0);
      expect(currentResult.september_paid).toBeFalsy();
      expect(currentResult.october).toEqual(0);
      expect(currentResult.october_paid).toBeFalsy();
      expect(currentResult.november).toEqual(0);
      expect(currentResult.november_paid).toBeFalsy();
      expect(currentResult.december).toEqual(0);
      expect(currentResult.december_paid).toBeFalsy();
      expect(currentResult.total).toEqual(100);
    });
  });

  describe('calculateAllPaid', () => {
    it('should return false when dont receive a list of incomes.', () => {
      expect(business.calculateAllPaid([])).toBeFalsy();
    });

    it('should return false when receive a list of incomes with all not paid.', () => {
      expect(business.calculateAllPaid([mockEntity])).toBeFalsy();
    });

    it('should return false when receive a list of incomes with all not paid when months is empty.', () => {
      expect(business.calculateAllPaid([{...mockEntity, months: []}])).toBeFalsy();
    });

    it('should return true when receive a list of incomes with all paid.', () => {
      expect(business.calculateAllPaid([{...mockEntity, months: mockEntity.months.map((item) => ({...item, paid: true})) }])).toBeTruthy();
    });
  })

  describe('calculateAll', () => {
    it('should return the correct values when the incomes is fixed', () => {
      mockCalculateAll.mockReturnValue({ total: 100, allPaid: false, totalPaid: 0, totalPending: 0 });
      const result = business.calculateAll([mockEntity]);
      expect(result[0].total).toEqual(100);
      expect(result[0].all_paid).toBeFalsy();
    });

    it('should return the correct values when the income is variable', () => {
      mockCalculateAll.mockReturnValue({ total: 100, allPaid: false, totalPaid: 0, totalPending: 0 });
      const result = business.calculateAll([{...mockEntity, months: mockMonths }]);
      expect(result[0].total).toEqual(100);
      expect(result[0].all_paid).toBeFalsy();
    });

    it('should return the correct values when the income is variable and all paid', () => {
      mockCalculateAll.mockReturnValue({ total: 100, allPaid: true, totalPaid: 100, totalPending: 0 });
      const result = business.calculateAll([{...mockEntity, months: mockMonths }]);
      expect(result[0].total).toEqual(100);
      expect(result[0].all_paid).toBeTruthy();
    })
  });

  describe('calculateAllTotal', () => {
    it('should return R$ 0,00 when dont receive a list of incomes.', () => {
      expect(business.calculateAllTotal([])).toEqual('R$ 0');
    });

    it('should return R$ 100,00 when receive a list of incomes with all not paid.', () => {
      expect(business.calculateAllTotal([mockEntity])).toEqual('R$ 100');
    });
  })
});