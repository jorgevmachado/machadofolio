import React ,{ useCallback ,useEffect ,useMemo ,useState } from 'react';

import { MONTHS, truncateString } from '@repo/services';

import { type Bill ,type Expense ,type Paginate } from '@repo/business';

import { ETypeTableHeader ,type TColors } from '@repo/ds';

import { useAlert, useModal } from '@repo/ui';

import { useI18n } from '@repo/i18n';

import { billService ,expenseBusiness ,expenseService } from '../../../shared';
import { useFinance } from '../../finances';

import Persist from '../components/persist';

import { ExpensesContext ,type ExpensesContextProps } from './ExpensesContext';
import {
  type OnFormPersistParams ,
  type OnSubmitParams ,
  type TableProps,
} from './types';

type ExpensesProviderProps = {
  bill: Bill;
  children: React.ReactNode;
}

const getCacheKey = (billId: string, page: number) => `${billId}_${page}`;

export default function ExpensesProvider({ bill, children }: ExpensesProviderProps) {
  const { t } = useI18n();

  const { openModal, modal, closeModal } = useModal();
  const { addAlert } = useAlert();
  const { expensesCache, setExpensesCache } = useFinance();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [results, setResults] = useState<Array<Expense>>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [billData, setBillData] = useState<Bill>(bill);
  const [externalCalculatedExpenses, setExternalCalculatedExpenses] = useState<Array<Expense>>([]);
  const [calculatedExpenses, setCalculatedExpenses] = useState<Array<Expense>>([]);

  const fetchExpenses = useCallback(async (billId: string, page: number) => {
    setIsLoading(true);
    try {
      const response = await expenseService.getAllByBill(billId, { page, limit: 10 }) as Paginate<Expense>;
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
    } catch (error) {
      addAlert({
        type: 'error',
        message: (error as Error)?.message ?? t('error_fetching_expenses') });
    } finally {
      setIsLoading(false);
    }
  }, [addAlert, bill.id, setExpensesCache, t]);
  
  const fetchBill = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await billService.get(id);
      setBillData(response);
    } catch (error) {
      addAlert({ type: 'error', message: (error as Error)?.message ?? t('error_fetching_bills') });
    } finally {
      setIsLoading(false);
    }
  }, [addAlert, t]);

  const handleSubmit = useCallback( async ({ create, update, expense }: OnSubmitParams) => {
    setIsLoading(true);
    try  {
      expense
        ? await expenseService.update(expense?.id, update)
        : await expenseService.create(create, bill?.id);
      addAlert({
        type: 'success',
        message: `${t('expense')} ${expense ? t('updated') : t('saved')} ${t('successfully')}!`
      });
      await fetchBill(bill?.id ?? '');
      fetchExpenses(bill?.id ?? '', currentPage);
    } catch (error) {
      addAlert({ type: 'error', message: (error as Error)?.message ?? `Error ${expense ? 'updating' : 'saving'} Expense` });
    } finally {
      setIsLoading(false);
    }
  }, [addAlert, bill?.id, currentPage, fetchBill, fetchExpenses, t]);

  const handleOpenPersistModal = useCallback(({ expense }: OnFormPersistParams) => {
    openModal({
      width: '799px',
      title: `${expense ? t('edit') : t('create')} ${t('expense')}`,
      body: (
        <Persist onClose={closeModal} onSubmit={handleSubmit} expense={expense}/>
      ),
      closeOnEsc: true,
      closeOnOutsideClick: true,
      removeBackgroundScroll: true,
    });
  }, [closeModal, handleSubmit, openModal, t]);

  const calculateExpenses = useCallback((expenses: Array<Expense>) => {
    return expenses?.map((expense) => expenseBusiness.calculate(expense));
  }, []);

  const calculateAllExpenses = useCallback((expenses: Array<Expense>) => {
    return expenseBusiness.calculateAll(expenses);
  }, []);

  const generateExpenseWithMonthsAndPaid = useCallback((expenses: Array<Expense>) => {
    return expenses?.map((expense) => expenseBusiness.convertMonthsToObject(expense));
  }, []);

  const headers = useMemo(() => {
    const monthHeaders: TableProps['headers'] = MONTHS.map((month) => ({
      text: truncateString(t(month), 3),
      type: ETypeTableHeader.MONEY,
      value: month,
      conditionColor: {
        value: `${month}_paid`,
        trueColor: 'success-80' as TColors,
        falseColor: 'error-80' as TColors,
      },
    }));
    return [
      { text: t('supplier'), value: 'supplier.name' },
      ...monthHeaders,
      { text: 'Total', value: 'total', type: ETypeTableHeader.MONEY },
    ];
  }, [t]);

  const items = useMemo(() => {
    return generateExpenseWithMonthsAndPaid(calculatedExpenses);
  }, [calculatedExpenses, generateExpenseWithMonthsAndPaid]);

  useEffect(() => {
    const cacheKey = getCacheKey(bill.id, currentPage);
    const cached = expensesCache[cacheKey];
    if (!cached || cached.billVersion !== bill.id) {
      fetchExpenses(bill.id, currentPage);
    } else {
      setResults(cached.results);
      setTotalPages(cached.totalPages);
    }
  } ,[bill.id, currentPage, expensesCache, fetchExpenses]);

  useEffect(() => {
    const externalCalculatedExpenses = calculateExpenses(bill?.expenses ?? []);
    setExternalCalculatedExpenses((externalCalculatedExpenses as Expense[]) || []);
  } ,[bill?.expenses, calculateExpenses]);

  useEffect(() => {
    const calculatedExpenses = calculateExpenses(externalCalculatedExpenses);
    setCalculatedExpenses(calculatedExpenses);
  } ,[calculateExpenses, externalCalculatedExpenses]);

  const context: ExpensesContextProps = {
    bill: billData,
    modal,
    items,
    headers,
    results,
    isLoading,
    updateBill: setBillData,
    totalPages,
    currentPage,
    setCurrentPage,
    calculateExpenses,
    calculatedExpenses,
    calculateAllExpenses,
    handleOpenPersistModal,
    externalCalculatedExpenses,
    generateExpenseWithMonthsAndPaid
  };
  return (
    <ExpensesContext.Provider value={context}>
      {children}
    </ExpensesContext.Provider>
  );
}