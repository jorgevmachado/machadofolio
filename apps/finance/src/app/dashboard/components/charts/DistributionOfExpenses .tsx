'use client'
import React, { useEffect, useState } from 'react';

import { useI18n } from '@repo/i18n';

import { currencyFormatter } from '@repo/services';

import { PieChart, TooltipChart } from '../../../../components';

import { type ExpenseEntity, EExpenseType } from '@repo/business';

type ExpensePieChartProps = {
    expenses: Array<ExpenseEntity>;
    className?: string;
}

export default function DistributionOfExpenses({ expenses, className }: ExpensePieChartProps) {
    const { t } = useI18n();

    const [data, setData] = useState<Array<{
        type: string;
        name: string;
        value: number;
        count: number;
    }>>([]);

    useEffect(() => {
        const fixed = expenses.filter((item) => item.type === EExpenseType.FIXED);
        const variable = expenses.filter((item) => item.type === EExpenseType.VARIABLE);

        const fixedTotal = fixed.reduce((acc, item) => acc + item.total, 0);
        const variableTotal = variable.reduce((acc, item) => acc + item.total, 0);
        setData([
            {
                name: t(EExpenseType.FIXED.toLowerCase()),
                value: fixedTotal,
                count: fixed.length,
                type: EExpenseType.FIXED
            },
            {
                name: t(EExpenseType.VARIABLE.toLowerCase()),
                value: variableTotal,
                count: variable.length,
                type: EExpenseType.VARIABLE
            }
        ]);
    }, [t]);

    // const data = React.useMemo(() => {
    //     const fixed = expenses.filter((item) => item.type === EExpenseType.FIXED);
    //     const variable = expenses.filter((item) => item.type === EExpenseType.VARIABLE);
    //
    //     const fixedTotal = fixed.reduce((acc, item) => acc + item.total, 0);
    //     const variableTotal = variable.reduce((acc, item) => acc + item.total, 0);
    //
    //     return [
    //         {
    //             name: t(EExpenseType.FIXED.toLowerCase()),
    //             value: fixedTotal,
    //             count: fixed.length,
    //             type: EExpenseType.FIXED
    //         },
    //         {
    //             name: t(EExpenseType.VARIABLE.toLowerCase()),
    //             value: variableTotal,
    //             count: variable.length,
    //             type: EExpenseType.VARIABLE
    //         }
    //     ];
    // }, [expenses]);

    const total = data.reduce((acc, item) => acc + item.value, 0);

    return (
        <PieChart
            data={data}
            total={total}
            title={t('distribution_of_expenses')}
            subtitle={`Total: ${currencyFormatter(total)}`}
            className={className}
            tooltipContent={(params) => (
                <TooltipChart {...params} countText="Quantity" valueText={t('value')} percentageText={t('percentage')}/>)}
        />
    );
}
