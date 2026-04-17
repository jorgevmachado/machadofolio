import React ,{ useEffect ,useState } from 'react';

import { Pagination ,Spinner ,Table  } from '@repo/ds';

import type { Bill ,Expense } from '@repo/business';

import { useExpenses } from '../../hooks';

import Summary from '../summary';

import './List.scss';

export default function ExpensesList() {
  const {
    bill: billData ,
    modal,
    results ,
    headers ,
    isLoading ,
    currentPage ,
    totalPages ,
    setCurrentPage ,
    calculateExpenses ,
    handleOpenPersistModal ,
    generateExpenseWithMonthsAndPaid,
  } = useExpenses();

  const [bill ,setBill] = useState<Bill | undefined>(billData);

  const [calculatedExpenses ,setCalculatedExpenses] = useState<Array<Expense>>(
    []
  );
  const [externalCalculatedExpenses ,setExternalCalculatedExpenses] = useState<Array<Expense>>(
    []
  );

  useEffect(() => {
    setBill(billData);
  } ,[billData]);

  useEffect(() => {
    const calculatedExpenses = calculateExpenses(results);
    setCalculatedExpenses((calculatedExpenses as Expense[]) || []);
  } ,[calculateExpenses ,results]);

  useEffect(() => {
    const externalCalculatedExpenses = calculateExpenses(bill?.expenses ?? []);
    setExternalCalculatedExpenses(
      (externalCalculatedExpenses as Expense[]) || []
    );
  } ,[bill?.expenses ,calculateExpenses]);

  return isLoading ? <Spinner/> : (
    <div className="expenses-list" data-testid="expenses-list">
      <Summary
        expenses={ externalCalculatedExpenses }
        action={ () => handleOpenPersistModal({}) }
      />
      <div className="expenses-list__table">
        <Table
          headers={ headers }
          items={ generateExpenseWithMonthsAndPaid(calculatedExpenses) }
          onRowClick={ (item) => handleOpenPersistModal(
            { expense: item as Expense }
          ) }
          loading={ isLoading }
        />
        { currentPage && totalPages > 1 && (
          <Pagination
            fluid
            type="numbers"
            total={ totalPages }
            range={ 10 }
            current={ currentPage }
            limitDots={ true }
            handleNew={ setCurrentPage }
          />
        ) }
        {modal}
      </div>
    </div>
  );
}