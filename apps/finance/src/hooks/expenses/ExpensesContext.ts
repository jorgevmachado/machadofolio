import React from 'react';

import { type Expense } from '@repo/business';

export type ExpensesContextProps = {
    results: Array<Expense>;
    isLoading: boolean;
    totalPages: number;
    currentPage: number;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export const ExpensesContext = React.createContext<ExpensesContextProps>({
  results: [],
  isLoading: false,
  totalPages: 1,
  currentPage: 1,
  setIsLoading: () => {},
  setCurrentPage: () => {},
});