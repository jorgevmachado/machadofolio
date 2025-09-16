'use client'
import React, { useEffect, useState } from 'react';

import { MONTHS, truncateString } from '@repo/services';

import { Expense } from '@repo/business';

import { Accordion, ETypeTableHeader, Table, type TColors } from '@repo/ds';

import Summary from '../summary';

import './CreditCard.scss';

type CreditCardProps = {
    items: Array<Expense>;
    action?: (expense?: Expense, parent?: Expense, parents?: Array<Expense>) => void;
    loading?: boolean;
}
export default function CreditCard({ items, action, loading }: CreditCardProps) {
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
    }

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
        if (!isParent) {
            return;
        }
        setChildrenOpenAccordion((prev) => prev === expense.id ? undefined : expense.id);

    }

    const handleOpenAccordion = (expense: Expense) => {
        return expense.id === childrenOpenAccordion;
    }

    const calculateExpenseParentBusiness = (expenses: Array<Expense>) => {
        expenses.forEach((expense) => {
            expense.total = expense?.children?.reduce((acc, expense) => acc + expense.total, 0) ?? 0;
            expense.paid = expense?.children?.every((expense) => expense.paid) ?? false;
            expense.total_paid = expense?.children?.reduce((acc, expense) => acc + (expense.paid ? expense.total : 0), 0) ?? 0;
            MONTHS.forEach((month) => {
                expense[month] = expense?.children?.reduce((acc, expense) => acc + expense[month], 0) ?? 0;
                expense[`${month}_paid`] = expense?.children?.every((expense) => expense[`${month}_paid`]) ?? false;
            })
        });
        return expenses;
    }

    const calculatedExpenses = (expenses: Array<Expense>, isParent: boolean) => {
        if (!isParent) {
            return expenses;
        }
        return calculateExpenseParentBusiness(expenses);
    }

    return (
        <div className="credit-card" data-testid="credit-card">
            <Summary expenses={expenses} action={() => action?.()}/>
            <div className="credit-card__table">
                <Table
                    headers={generateHeaders(isParent)}
                    items={calculatedExpenses(expenses, isParent)}
                    onRowClick={(item) => handleOnRowClick(item as Expense)}
                    loading={loading}
                />
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
    )
}