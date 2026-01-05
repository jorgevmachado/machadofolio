import { type Income ,type MonthsObject } from '@repo/business';

export type GenerateIncomeWithMonthsAndPaid = MonthsObject & Income & {
  total: number;
};

export type CurrentValueParams = {
  name?: string;
  item?: Income;
}