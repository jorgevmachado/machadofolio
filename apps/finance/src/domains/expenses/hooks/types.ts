import type React from 'react';

import type {
  CreateExpenseParams ,
  Expense,
  MonthsCalculated,
  UpdateExpenseParams } from '@repo/business';

export type OnSubmitParams = {
  create: CreateExpenseParams;
  update: UpdateExpenseParams;
  expense?: Expense;
}

export type OnFormPersistParams = {
  parent?: Expense;
  parents?: Array<Expense>;
  expense?: Expense;
}

import type { Table } from '@repo/ds';

export type AllCalculated = MonthsCalculated;

export type TableProps = React.ComponentProps<typeof Table>;