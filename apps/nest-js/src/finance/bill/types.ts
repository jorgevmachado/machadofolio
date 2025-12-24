import {
  type PersistMonthParams ,
  type SpreadsheetProcessingParams as SpreadsheetProcessingBusinessParams ,
} from '@repo/business';

import type { Bank } from '../entities/bank.entity';
import { type Bill } from '../entities/bill.entity';
import type { Finance } from '../entities/finance.entity';
import type { Group } from '../entities/group.entity';
import type { FinanceSeederParams } from '../types';

export type ExistExpenseInBill = {
  year?: number;
  nameCode: string;
  withThrow?: boolean;
  fallBackMessage?: string;
}

export type BillSeederParams = Pick<FinanceSeederParams ,'billListJson'> & {
  banks: Array<Bank>;
  groups: Array<Group>;
  finance: Finance;
}

export type SpreadsheetProcessingParams =
  Pick<SpreadsheetProcessingBusinessParams ,'sheet' | 'startRow' | 'tableWidth' | 'groupsName' | 'startColumn'>
  & {
  year?: number;
  groupId: string;
  groupName: string;
}

export type BillExpenseToCreateParams = {
  year: number;
  paid: boolean;
  date: Date;
  type: string;
  bank: string;
  month: string;
  group: string;
  title: string;
  amount: string;
  finance: Finance;
}

export type BillExpenseToCreate = Omit<BillExpenseToCreateParams ,'month'> & {
  bill: Bill;
  months: Array<PersistMonthParams>;
}