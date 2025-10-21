'use client'
import { useEffect, useState } from 'react';

import { useI18n } from '@repo/i18n';

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
    const [currentLabel, setCurrentLabel] = useState<string>(label);
    const { t } = useI18n();

    const [allCalculated, setAllCalculated] = useState<AllCalculatedSummary | undefined>(undefined);

    const calculateAllExpenses = (expenses: Array<Expense>) => {
        const calculatedAllExpenses = expenseBusiness.calculateAll(expenses);
        setAllCalculated(calculatedAllExpenses);
    };

    useEffect(() => {
        calculateAllExpenses(expenses);
    }, [expenses]);

    useEffect(() => {
        if(label === 'Add Expense') {
            setCurrentLabel(`${t('add')} ${t('expense')}`)
            return;
        }
        setCurrentLabel(label)
    }, [t, label]);

    const handleOnClick = () => {
        action?.();
    }

    return allCalculated ? (
        <CalculationSummary
            total={allCalculated.total}
            action={{
                label: currentLabel,
                onClick: handleOnClick
            }}
            allPaid={allCalculated.allPaid}
            allPaidLabel={`${t('expenses')} ${t('paid')}`}
            totalPaid={allCalculated.totalPaid}
            totalPending={allCalculated.totalPending}
        />
    ) : null;
}