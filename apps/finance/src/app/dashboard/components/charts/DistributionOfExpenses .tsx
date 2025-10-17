'use client'
import React from 'react';

import { currencyFormatter } from '@repo/services';

import { PieChart, TooltipChart } from '../../../../components';

import { type ExpenseEntity, EExpenseType } from '@repo/business';

type ExpensePieChartProps = {
    expenses: Array<ExpenseEntity>;
    className?: string;
}

export default function DistributionOfExpenses({ expenses, className }: ExpensePieChartProps) {
    const data = React.useMemo(() => {
        const fixed = expenses.filter((item) => item.type === EExpenseType.FIXED);
        const variable = expenses.filter((item) => item.type === EExpenseType.VARIABLE);

        const fixedTotal = fixed.reduce((acc, item) => acc + item.total, 0);
        const variableTotal = variable.reduce((acc, item) => acc + item.total, 0);

        return [
            {
                name: EExpenseType.FIXED,
                value: fixedTotal,
                count: fixed.length,
                type: EExpenseType.FIXED
            },
            {
                name: EExpenseType.VARIABLE,
                value: variableTotal,
                count: variable.length,
                type: EExpenseType.VARIABLE
            }
        ];
    }, [expenses]);

    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <PieChart
            data={data}
            total={total}
            title="Distribution of Expenses"
            subtitle={`Total: ${currencyFormatter(total)}`}
            className={className}
            tooltipContent={(params) => (
                <TooltipChart {...params} countText="Quantity" valueText="Value" percentageText="Percentage"/>)}
        />
    );
}
