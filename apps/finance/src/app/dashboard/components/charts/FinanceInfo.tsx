'use client'
import React from 'react';

import { Text } from '@repo/ds';

import { BarChart, TooltipChart } from '../../../../components';

type FinanceBarChartProps = {
    total: number;
    totalPaid: number;
    className?: string;
    totalPending: number;
    totalRegisteredExpenses: number;
}

export default function FinanceInfo({ total, totalPaid, className, totalPending, totalRegisteredExpenses }: FinanceBarChartProps) {
    const data = [
        {
            type: 'finance',
            name: 'Total',
            value: total,
            fill: '#8b5cf6'
        },
        {
            type: 'finance',
            name: 'Pago',
            value: totalPaid,
            fill: '#10b981'
        },
        {
            type: 'finance',
            name: 'Pendente',
            value: totalPending,
            fill: '#ef4444'
        }
    ];

    return (
        <BarChart
            type="vertical"
            data={data} title="Financial Overview"
            className={className}
            subtitle="Comparison between total values"
            tooltipContent={(params) => (<TooltipChart {...params} valueText="Value"/>)}
        >
            <Text variant="medium" color="neutral-80">
                {totalRegisteredExpenses} registered expenses
            </Text>
        </BarChart>
    );
}
