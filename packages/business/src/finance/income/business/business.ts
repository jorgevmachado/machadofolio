import { currencyFormatter } from '@repo/services';

import { MonthBusiness } from '../../month';

import type Income from '../income';
import { type IncomeWithMonthsAndPaid } from '../types';

export default class IncomeBusiness {
  private readonly monthsBusiness: MonthBusiness;
  constructor() {
    this.monthsBusiness = new MonthBusiness();
  }

  public calculate(income: Income): Income {
    const monthsCalculated = this.monthsBusiness.calculateAll(income.months);
    income.total = monthsCalculated.total;
    income.all_paid = monthsCalculated.allPaid;
    return income;
  }

  public convertMonthsToObject(income: Income): IncomeWithMonthsAndPaid {
    const objectMonths = this.monthsBusiness.convertMonthsToObject(income.months);
    const incomeCalculated = this.calculate(income);
    return {
      ...objectMonths,
      ...incomeCalculated
    };
  }

  public convertMonthsToArray(income: Income): Array<IncomeWithMonthsAndPaid> {
    const incomeObjectMonths = this.convertMonthsToObject(income);
    return [incomeObjectMonths];
  }

  public calculateAllPaid(incomes: Array<Income>): boolean {
    if(incomes.length === 0){
      return false;
    }
    return incomes.every(income =>
      income.months?.length
        ? income.months.every(month => month.paid)
        : false);
  }
  
  public calculateAllTotal(incomes: Array<Income>): string {
    if(incomes.length === 0){
      return currencyFormatter(0);
    }
    const total = incomes.reduce((sum, income) => sum + income.total, 0);
    return currencyFormatter(total);
  }

  public calculateAll(incomes: Array<Income> = []): Array<Income> {
    return incomes.map(income => this.calculate(income));
  }
}