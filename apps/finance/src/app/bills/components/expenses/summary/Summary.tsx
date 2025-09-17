'use client'

import { currencyFormatter } from '@repo/services';

import { AllExpensesCalculated, Expense } from '@repo/business';

import { Button, type TColors, Text } from '@repo/ds';

import './Summary.scss';
import { useEffect, useState } from 'react';
import { expenseBusiness } from '../../../../../shared';

type SummaryProps = {
    label?: string;
    action?: () => void;
    expenses?: Array<Expense>;
}

type ItemSummary = {
    key: string;
    label: string;
    value: {
        label: string | number;
        color?: TColors;
    }
}

export default function Summary({
    label = 'Add Expense',
    action,
    expenses = []
}: SummaryProps) {

    const [itemSummary, setItemSummary] = useState<Array<ItemSummary>>([]);

    const generateItemSummary = (calculatedAllExpenses: AllExpensesCalculated) => {
        const items: Array<ItemSummary> = [
            {
                key: 'expenses_paid',
                label: 'Expenses Paid: ',
                value: {
                    label: calculatedAllExpenses.allPaid ? 'Yes' : 'No',
                    color: calculatedAllExpenses.allPaid ? 'success-80' : 'error-80'
                },
            },
            {
                key: 'total',
                label: 'Total: ',
                value: {
                    label: currencyFormatter(calculatedAllExpenses.total),
                }
            },
            {
                key: 'total_paid',
                label: 'Total Paid:',
                value: {
                    label: currencyFormatter(calculatedAllExpenses.totalPaid),
                }
            },
            {
                key: 'total_pending',
                label: 'Total Pending:',
                value: {
                    label: currencyFormatter(calculatedAllExpenses.totalPending),
                }
            }
        ];
        setItemSummary(items);
    }

    const calculateAllExpenses = (expenses: Array<Expense>) => {
        const calculatedAllExpenses = expenseBusiness.calculateAll(expenses);
        generateItemSummary(calculatedAllExpenses);
    };

    useEffect(() => {
        calculateAllExpenses(expenses);
    }, [expenses]);

    return (
        <div className="summary" data-testid="expenses-summary">
            <div className="summary__text">
                {itemSummary.map((item) => (
                    <div key={item.key} className="summary__text--item">
                        <Text
                            id={`expenses-summary-item-label-${item.key}`}
                            tag="p"
                            color="neutral-100"
                            weight="bold"
                            variant="medium"
                            data-testid={`expenses-summary-item-label-${item.key}`}>
                            {item.label}
                        </Text>
                        <Text
                            id={`expenses-summary-item-value-${item.key}`}
                            tag="p"
                            color={item.value?.color ?? 'neutral-100'}
                            variant="medium"
                            data-testid={`expenses-summary-item-value-${item.key}`}>
                            {item.value.label}
                        </Text>
                    </div>
                ))}
            </div>
            {action && (
                <div className="summary__action">
                    <Button onClick={action} context="success">
                        {label}
                    </Button>
                </div>
            )}
        </div>
    )
}