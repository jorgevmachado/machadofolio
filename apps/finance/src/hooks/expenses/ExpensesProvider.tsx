import React, { type ReactNode, useCallback, useEffect, useState } from 'react';

import { type Bill, type Expense, type Paginate } from '@repo/business';

import { expenseService } from '../../shared';

import { useFinance } from '../finance';

import { ExpensesContext, type ExpensesContextProps } from './ExpensesContext';

type ExpensesProviderProps = {
    bill: Bill;
    children: ReactNode;
}

const getCacheKey = (billId: string, page: number) => `${billId}_${page}`;

export default function ExpensesProvider({ bill, children }: ExpensesProviderProps) {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { expensesCache, setExpensesCache } = useFinance();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [results, setResults] = useState<Array<Expense>>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchExpenses = useCallback(async (billId: string, page: number) => {
    setIsLoading(true);
    try {
      const response = await expenseService.getAllByBill(billId, {
        page,
        limit: 10
      }) as Paginate<Expense>;
      setExpensesCache(prev => ({
        ...prev,
        [getCacheKey(billId, page)]: {
          results: response.results,
          totalPages: response.pages,
          billVersion: bill.id || '',
        },
      }));
      setResults(response.results);
      setTotalPages(response.pages);
      return response;
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'Error fetching Expenses';
      console.error('# => ExpensesProvider => error => ', errorMessage);
    } finally {
      setIsLoading(false);
    }

  }, [bill.id, setExpensesCache]);


  useEffect(() => {
    const cacheKey = getCacheKey(bill.id, currentPage);
    const cached = expensesCache[cacheKey];

    if (!cached || cached.billVersion !== bill.id) {
      fetchExpenses(bill.id, currentPage);
    } else {
      setResults(cached.results);
      setTotalPages(cached.totalPages);
    }

  }, [bill.id, currentPage, expensesCache, fetchExpenses]);

  const context: ExpensesContextProps = {
    results,
    isLoading,
    totalPages,
    currentPage,
    setIsLoading,
    setCurrentPage,
  };

  return (
    <ExpensesContext value={context}>
      {children}
    </ExpensesContext>
  );
}