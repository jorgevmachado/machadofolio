'use client'

import { currencyFormatter } from '@repo/services';

import type { AllExpensesCalculated } from '@repo/business';

import { Button, type TColors, Text } from '@repo/ds';

import './Summary.scss';

type SummaryProps = AllExpensesCalculated & {
    action: () => void;
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
    total,
    action,
    allPaid,
    totalPaid,
    totalPending
}: SummaryProps) {
    const items: Array<ItemSummary> = [
        {
            key: 'expenses_paid',
            label: 'Expenses Paid: ',
            value: {
                label: allPaid ? 'Yes' : 'No',
                color: allPaid ? 'success-80' : 'error-80'
            },
        },
        {
            key: 'total',
            label: 'Total: ',
            value: {
                label: currencyFormatter(total),
            }
        },
        {
            key: 'total_paid',
            label: 'Total Paid:',
            value: {
                label: currencyFormatter(totalPaid),
            }
        },
        {
            key: 'total_pending',
            label: 'Total Pending:',
            value: {
                label: currencyFormatter(totalPending),
            }
        }
    ]
    return (
        <div className="summary" data-testid="expenses-summary">
            <div className="summary__text">
                {items.map((item) => (
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
            <div className="summary__action">
                <Button onClick={action} context="success">
                    Add Expense
                </Button>
            </div>
        </div>
    )
}