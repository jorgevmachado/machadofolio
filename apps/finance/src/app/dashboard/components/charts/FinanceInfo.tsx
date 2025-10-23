'use client'
import React from 'react';

import { useI18n } from '@repo/i18n';

import { Chart, Text } from '@repo/ds';

type FinanceBarChartProps = {
    total: number;
    totalPaid: number;
    className?: string;
    totalPending: number;
    totalRegisteredExpenses: number;
}

export default function FinanceInfo({ total, totalPaid, className, totalPending, totalRegisteredExpenses }: FinanceBarChartProps) {
    const { t } = useI18n();

    return (
        <Chart
            type="bar"
            data={[
                {
                    type: 'highlight',
                    name: t('total'),
                    value: Number(total.toFixed(2)),
                    fill: '#8b5cf6'
                },
                {
                    type: 'highlight',
                    name: t('paid'),
                    value: Number(totalPaid.toFixed(2)),
                    fill: '#10b981'
                },
                {
                    type: 'highlight',
                    name: t('pending'),
                    value: Number(totalPending.toFixed(2)),
                    fill: '#ef4444'
                }
            ]}
            title={t('financial_overview')}
            subtitle={t('comparison_between_total_values')}
            className={className}
            layoutType="vertical"
            chartTooltip={{
                valueText: t('value')
            }}
        >
            <Text variant="medium" color="neutral-80">
                {totalRegisteredExpenses} {t('registered_expenses')}
            </Text>
        </Chart>
    );
}
