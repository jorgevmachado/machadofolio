'use client'
import React, { useMemo, useState } from 'react';

import { useI18n } from '@repo/i18n';

import { currencyFormatter } from '@repo/services';

import { type ExpenseEntity, EExpenseType } from '@repo/business';

import { Charts, type PieChartProps } from '@repo/ds';

type ExpensePieChartProps = {
    expenses: Array<ExpenseEntity>;
    className?: string;
}

export default function DistributionOfExpenses({ expenses, className }: ExpensePieChartProps) {
    const { t } = useI18n();

    const [total, setTotal] = useState<number>(0);

    const pieChart = useMemo(() => {
        const fixed = expenses.filter((item) => item.type === EExpenseType.FIXED);
        const variable = expenses.filter((item) => item.type === EExpenseType.VARIABLE);

        const fixedTotal = fixed.reduce((acc, item) => acc + item.total, 0);
        const variableTotal = variable.reduce((acc, item) => acc + item.total, 0);

        const currentData: PieChartProps['data'][number]['data'] = [
            {
                name: t(EExpenseType.FIXED.toLowerCase()),
                value: Number(fixedTotal.toFixed(2)),
                count: fixed.length,
                type: 'highlight'
            },
            {
                name: t(EExpenseType.VARIABLE.toLowerCase()),
                value: Number(variableTotal.toFixed(2)),
                count: variable.length,
                type: 'highlight'
            },
        ];

        const percentageTotal = currentData.reduce((acc, item) => acc + (item.value as number), 0);
        setTotal(percentageTotal);

        const data =  currentData.map((item) => ({
            ...item,
            percentageTotal,
        })) as unknown as PieChartProps['data'][number]['data'];

        const props: PieChartProps = {
            data: [
                {
                    key: 'distribution_of_expenses',
                    cx: '50%',
                    cy: '50%',
                    data,
                    dataKey: 'value',
                    labelLine: false,
                    isAnimationActive: true,
                }
            ],
            withDefaultCustomLabel: true
        }

        return props;

    }, [expenses, t])

    return (
        <Charts
            type="pie"
            title={t('distribution_of_expenses')}
            legend={{
                show: true,
            }}
            pieChart={pieChart}
            subtitle={`Total: ${currencyFormatter(total)}`}
            fallback={{ text: t('no_expenses_registered') }}
            className={className}
        />
    );
}