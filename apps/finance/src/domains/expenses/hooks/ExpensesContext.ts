import React from 'react';

import type { Bill ,Expense ,ExpenseWithMonthsAndPaid } from '@repo/business';

import type{
  AllCalculated ,
  OnFormPersistParams ,
  TableProps,
} from './types';

export type ExpensesContextProps = {
  bill?: Bill;
  modal: React.ReactNode;
  items: TableProps['items'];
  headers: TableProps['headers'];
  results: Array<Expense>;
  isLoading: boolean;
  updateBill: (bill: Bill) => void;
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  calculateExpenses: (expenses: Array<Expense>) => Array<Expense>;
  calculatedExpenses: Array<Expense>;
  calculateAllExpenses: (expenses: Array<Expense>) => AllCalculated;
  handleOpenPersistModal: (params: OnFormPersistParams) => void;
  externalCalculatedExpenses: Array<Expense>;
  generateExpenseWithMonthsAndPaid: (expenses: Array<Expense>) => Array<ExpenseWithMonthsAndPaid>;
};

export const ExpensesContext = React.createContext<ExpensesContextProps>({
  bill: undefined,
  modal: null,
  items: [],
  headers: [],
  results: [],
  isLoading: false,
  updateBill: () => {},
  totalPages: 1,
  currentPage: 1,
  setCurrentPage: () => {},
  calculateExpenses: () => [],
  calculatedExpenses: [],
  calculateAllExpenses: () => ({ total: 0, allPaid: true, totalPaid: 0, totalPending: 0 } as AllCalculated),
  handleOpenPersistModal: () => {},
  externalCalculatedExpenses: [],
  generateExpenseWithMonthsAndPaid: () => [],
});