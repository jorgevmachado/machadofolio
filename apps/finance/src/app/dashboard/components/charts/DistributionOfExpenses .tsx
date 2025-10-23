'use client'
import React, { useEffect, useState } from 'react';

import { useI18n } from '@repo/i18n';

import { currencyFormatter } from '@repo/services';

import { type ExpenseEntity, EExpenseType } from '@repo/business';

import { Chart, type DataChartItem } from '@repo/ds';

type ExpensePieChartProps = {
    expenses: Array<ExpenseEntity>;
    className?: string;
}

export default function DistributionOfExpenses({ expenses, className }: ExpensePieChartProps) {
    const { t } = useI18n();

    const [data, setData] = useState<Array<Omit<DataChartItem, 'color'>>>([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const fixed = expenses.filter((item) => item.type === EExpenseType.FIXED);
        const variable = expenses.filter((item) => item.type === EExpenseType.VARIABLE);

        const fixedTotal = fixed.reduce((acc, item) => acc + item.total, 0);
        const variableTotal = variable.reduce((acc, item) => acc + item.total, 0);

        const currentData: Array<Omit<DataChartItem, 'color'>> = [
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
            }
        ];

        const percentageTotal = currentData.reduce((acc, item) => acc + item.value, 0);
        setTotal(percentageTotal);

        setData(currentData.map((item) => ({
            ...item,
            percentageTotal,
        })));
    }, [t]);

    return (
        <Chart
            type="pie"
            data={data}
            title={t('distribution_of_expenses')}
            subtitle={`Total: ${currencyFormatter(total)}`}
            className={className}
        />
    );
}
