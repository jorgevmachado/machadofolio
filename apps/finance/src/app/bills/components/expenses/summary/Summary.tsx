'use client'
import { useEffect, useState } from 'react';

import { Expense } from '@repo/business';

import { expenseBusiness } from '../../../../../shared';
import CalculationSummary, { AllCalculatedSummary } from '../../calculation-summary';

import './Summary.scss';

type SummaryProps = {
    label?: string;
    action?: () => void;
    expenses?: Array<Expense>;
}

export default function Summary({
                                    label = 'Add Expense',
                                    action,
                                    expenses = []
                                }: SummaryProps) {

    const [allCalculated, setAllCalculated] = useState<AllCalculatedSummary | undefined>(undefined);

    const calculateAllExpenses = (expenses: Array<Expense>) => {
        const calculatedAllExpenses = expenseBusiness.calculateAll(expenses);
        setAllCalculated(calculatedAllExpenses);
    };

    useEffect(() => {
        calculateAllExpenses(expenses);
    }, [expenses]);

    const handleOnClick = () => {
        action?.();
    }

    return allCalculated ? (
        <CalculationSummary
            total={allCalculated.total}
            action={{
                label,
                onClick: handleOnClick
            }}
            allPaid={allCalculated.allPaid}
            allPaidLabel="Expenses Paid"
            totalPaid={allCalculated.totalPaid}
            totalPending={allCalculated.totalPending}
        />
    ) : null;
}