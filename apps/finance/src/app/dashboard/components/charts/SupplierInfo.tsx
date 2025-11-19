'use client'
import React, { useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { useI18n } from '@repo/i18n';

import { convertToNumber } from '@repo/services';

import type { ExpenseEntity } from '@repo/business';

import { type BarChartProps, Button, Charts, Text, type TooltipProps } from '@repo/ds';

type SupplierBarChartProps = {
    expenses: Array<ExpenseEntity>;
    className?: string;
    totalRegisteredSuppliers: number;
}

export default function SupplierInfo({ expenses, className, totalRegisteredSuppliers }: Readonly<SupplierBarChartProps>) {
    const router = useRouter();
    const { t } = useI18n();

    const barChart = useMemo(() => {
        const supplierMap = new Map<string, BarChartProps['data'][number]>();

        expenses.forEach((expense, index) => {
            const supplierId = expense.supplier.id;
            const supplierName = expense.supplier.name;
            if (supplierMap.has(supplierId)) {
                const current = supplierMap.get(supplierId);
                if (current) {
                    const value = convertToNumber(current?.value);
                    const count = convertToNumber(current?.count);
                    supplierMap.set(supplierId, {
                        type: 'highlight',
                        name: supplierName,
                        index,
                        value: value + expense.total,
                        count: count + 1
                    })
                }
            } else {
                supplierMap.set(supplierId, {
                    type: 'highlight',
                    name: supplierName,
                    index,
                    value: expense.total,
                    count: 1
                })
            }
        })

        const array = Array.from(supplierMap.values());

        const data = array
            .sort((a, b) => {
                const bValue = convertToNumber(b.value);
                const aValue = convertToNumber(a.value);
                return bValue - aValue!
            }).map((item) => ({
                ...item,
                name: t(item.name)
            }))

        const props: BarChartProps = {
            top: 5,
            data,
            labels: [{ key: 'value', fill: '#808080' }],
        }
        return props;
    }, [t, expenses]);

    const tooltip = useMemo(() => {
        const props: TooltipProps = {
            countProps: {
                show: true,
                text: t('expenses'),
            },
            valueProps: {
                show: true,
                text: t('total'),
                withCurrencyFormatter: true
            }
        }
        return props;
    }, [t])


    return (
        <Charts
            type="bar"
            title={`Top 5 ${t('suppliers')}`}
            layout="horizontal"
            legend={{ show: false }}
            subtitle={`${t('suppliers')} ${t('with_the_highest_expenses')}`}
            fallback={t('no_expenses_registered')}
            className={className}
            barChart={barChart}
            tooltip={tooltip}
            wrapperType="card"
            withAxisCurrencyTickFormatter
        >
            <Text variant="medium" color="neutral-80">
                {totalRegisteredSuppliers} {t('registered')} {t('suppliers')}
            </Text>
            <Button
                size="small"
                context="primary"
                onClick={() => router.push('/banks')}>
                {t('view_details')}
            </Button>
        </Charts>
    );
}