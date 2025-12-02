'use client';
import React, { useEffect, useState } from 'react';

import { MONTHS, truncateString } from '@repo/services';

import { type Bill, EBillType, type Expense } from '@repo/business';

import { ETypeTableHeader, Pagination, Spinner, Table, type TColors } from '@repo/ds';

import { useAlert, useModal } from '@repo/ui';

import { useI18n } from '@repo/i18n';

import { useExpenses } from '../../../../hooks';
import { billService, expenseBusiness, expenseService } from '../../../../shared';

import CreditCard from './credit-card';
import { type OnSubmitParams, Persist } from './persist';
import Summary from './summary';

import './Expenses.scss';

type ExpensesProps = {
    bill: Bill;
}

type OpenFormModalParams = {
    parent?: Expense;
    parents?: Array<Expense>;
    expense?: Expense;
}

export default function Expenses({ bill: billData }: ExpensesProps) {
  const { t } = useI18n();
  const [calculatedExpenses, setCalculatedExpenses] = useState<Array<Expense>>([]);
  const [calculatedExternalExpenses, setCalculatedExternalExpenses] = useState<Array<Expense>>([]);
  const [bill, setBill] = useState<Bill | undefined>(billData);

  const { results, isLoading, totalPages, currentPage, setCurrentPage, setIsLoading } = useExpenses();

  const { addAlert } = useAlert();
  const { openModal, modal, closeModal } = useModal();


  const handleSubmit = async ({ create, update, expense }: OnSubmitParams) => {
    setIsLoading(true);
    try {
      expense
        ? await expenseService.update(expense.id, update)
        : await expenseService.create(create, bill?.id);
      addAlert({
        type: 'success',
        message: `${t('expense')} ${expense ? t('updated') : t('saved')} ${t('successfully')}!`
      });
      await fetchBill(bill?.id ?? '');
    } catch (error) {
      addAlert({
        type: 'error',
        message: (error as Error)?.message ?? `Error ${expense ? 'updating' : 'saving'} Expense`
      });
      console.error('Expense => handleSubmit => ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFormModal = ({ expense, parent, parents }: OpenFormModalParams) => {
    openModal({
      width: '799px',
      title: `${expense ? t('edit') : t('create')} ${t('expense')}`,
      body: (
        <Persist
          onClose={closeModal}
          expense={expense}
          onSubmit={handleSubmit}
          parent={parent}
          parents={parents}
        />
      ),
      closeOnEsc: true,
      closeOnOutsideClick: true,
      removeBackgroundScroll: true,
    });
  };

  const generateHeaders = () => {
    const monthHeaders = MONTHS.map((month) => ({
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
  };

  const calculateExpenses = (expenses: Array<Expense>) => {
    return expenses?.map((expense) => expenseBusiness.calculate(expense));
  };

  const fetchBill = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await billService.get(id);
      setBill(response);
    } catch (error) {
      addAlert({ type: 'error', message: t('error_fetching_bills') });
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateExpenseWithMonthsAndPaid = (expenses: Array<Expense>) => {
    return expenses?.map((expense) => expenseBusiness.convertMonthsToObject(expense));
  };

  useEffect(() => {
    setBill(billData);
  }, [billData]);

  useEffect(() => {
    const calculatedExpenses = calculateExpenses(results);
    setCalculatedExpenses((calculatedExpenses as Expense[]) || []);
  }, [results]);

  useEffect(() => {
    const externalCalculatedExpenses = calculateExpenses(bill?.expenses ?? []);
    setCalculatedExternalExpenses((externalCalculatedExpenses as Expense[]) || []);
  }, [bill?.expenses]);

  return isLoading ? <Spinner/> : (
    <div className="expenses" data-testid="expenses">
      {bill?.type === EBillType.CREDIT_CARD
        ? (
          <CreditCard
            items={calculatedExpenses}
            action={(expense, parent, parents) => handleOpenFormModal({ expense, parent, parents })}
            loading={isLoading}
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
            calculatedExternalExpenses={calculatedExternalExpenses}
          />
        )
        : (
          <>
            <Summary expenses={calculatedExternalExpenses} action={() => handleOpenFormModal({})}/>
            <div className="expenses__table">
              <Table
                headers={generateHeaders()}
                items={generateExpenseWithMonthsAndPaid(calculatedExpenses)}
                onRowClick={(item) => handleOpenFormModal({ expense: item as Expense })}
                loading={isLoading}
              />
              {currentPage && totalPages > 1 && (
                <Pagination
                  fluid
                  type="numbers"
                  total={totalPages}
                  range={10}
                  current={currentPage}
                  limitDots={true}
                  handleNew={setCurrentPage}
                />
              )}
            </div>
          </>
        )
      }
      {modal}
    </div>
  );
}