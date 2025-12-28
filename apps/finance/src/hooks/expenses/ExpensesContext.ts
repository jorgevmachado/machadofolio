import React from 'react';

import { type Bill ,type Expense } from '@repo/business';

export type ExpensesContextProps = {
    bill?: Bill;
    results: Array<Expense>;
    isLoading: boolean;
    updateBill: (bill: Bill) => void;
    totalPages: number;
    currentPage: number;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export const ExpensesContext = React.createContext<ExpensesContextProps>({
  bill: undefined,
  results: [],
  isLoading: false,
  updateBill: () => {},
  totalPages: 1,
  currentPage: 1,
  setIsLoading: () => {},
  setCurrentPage: () => {},
});