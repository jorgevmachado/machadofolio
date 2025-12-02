'use client';
import React, { useEffect, useState } from 'react';

import { MONTHS, truncateString } from '@repo/services';

import { type Expense } from '@repo/business';

import { Accordion, ETypeTableHeader, Pagination, Table, type TColors } from '@repo/ds';

import { expenseBusiness } from '../../../../../shared';

import Summary from '../summary';

import './CreditCard.scss';


type CreditCardProps = {
    items: Array<Expense>;
    action?: (expense?: Expense, parent?: Expense, parents?: Array<Expense>) => void;
    loading?: boolean;
    totalPages: number;
    currentPage: number;
    handlePageChange?: (page: number) => void;
    calculatedExternalExpenses: Array<Expense>;
}
export default function CreditCard({
  items,
  action,
  loading,
  totalPages,
  currentPage,
  handlePageChange,
  calculatedExternalExpenses
}: CreditCardProps) {
  const [expenses, setExpenses] = useState<Array<Expense>>([]);
  const [isParent, setIsParent] = useState<boolean>(false);
  const [childrenOpenAccordion, setChildrenOpenAccordion] = useState<string | undefined>(undefined);

  const generateHeaders = (isParent: boolean) => {
    const monthHeaders = MONTHS.map((month) => ({
      text: truncateString(month, 3),
      type: ETypeTableHeader.MONEY,
      value: month,
      conditionColor: {
        value: `${month}_paid`,
        trueColor: 'success-80' as TColors,
        falseColor: 'error-80' as TColors,
      },
    }));
    return [
      { text: isParent ? 'Bills' : 'Supplier', value: 'supplier.name' },
      ...monthHeaders,
      { text: 'Total', value: 'total', type: ETypeTableHeader.MONEY },
    ];
  };

  useEffect(() => {
    const parents = items?.filter((item) => item.children && item?.children?.length > 0);
    if (parents?.length) {
      setIsParent(true);
      setExpenses(parents);
      return;
    }
    setExpenses(items);
  }, [items]);

  const handleOnRowClick = (expense: Expense) => {
    if (expense?.children && expense?.children?.length > 0 && !isParent) {
      return;
    }
    if (!isParent) {
      action?.(expense, undefined, expenses);
      return;
    }

    setChildrenOpenAccordion((prev) => prev === expense.id ? undefined : expense.id);

  };

  const handleOpenAccordion = (expense: Expense) => {
    return expense.id === childrenOpenAccordion;
  };

  const calculateExpenseParentBusiness = (expenses: Array<Expense>) => {
    return expenses.map((expense) => {
      const { total, allPaid, totalPaid } =  expenseBusiness.calculateAll(expense.children);
      expense.total = total;
      expense.paid = allPaid;
      expense.total_paid = totalPaid;
      return expenseBusiness.convertMonthsToObject(expense);
    });
  };

  const calculatedExpenses = (expenses: Array<Expense>, isParent: boolean) => {
    if (!isParent) {
      return convertListOfMonthsToObject(expenses);
    }
    return calculateExpenseParentBusiness(expenses);
  };

  const convertListOfMonthsToObject = (expenses: Array<Expense>) => {
    return expenses?.map((expense) => expenseBusiness.convertMonthsToObject(expense));
  };

  return (
    <div className="credit-card" data-testid="credit-card">
      <Summary expenses={calculatedExternalExpenses} action={() => action?.()}/>
      <div className="credit-card__table">
        <Table
          headers={generateHeaders(isParent)}
          items={calculatedExpenses(expenses, isParent)}
          onRowClick={(item) => handleOnRowClick(item as Expense)}
          loading={loading}
        />
        {currentPage && totalPages > 1 && (
          <Pagination
            fluid
            type="numbers"
            total={totalPages}
            range={10}
            current={currentPage}
            limitDots={true}
            handleNew={handlePageChange}
          />
        )}
      </div>
      {isParent && (
        <div className="credit-card__accordions" data-testid="credit-card-accordions">
          {expenses.map((item) => (
            <div key={item.id} className="credit-card__accordion">
              <Accordion id={item.id} title={item.supplier.name} isOpen={handleOpenAccordion(item)}>
                <Summary expenses={item.children} action={() => action?.(undefined, item, expenses)}/>
                <div className="credit-card__table">
                  <Table
                    headers={generateHeaders(!isParent)}
                    items={item.children ?? []}
                    onRowClick={(child) => action?.(child as Expense, item, expenses)}
                    loading={loading}
                  />
                </div>
              </Accordion>
            </div>
          ))}

        </div>

      )}
    </div>
  );
}