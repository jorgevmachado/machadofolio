'use client'
import React from 'react';

import { useRouter } from 'next/navigation';

import type { ExpenseEntity } from '@repo/business';

import { Button, Text } from '@repo/ds';

import { BarChart, TooltipChart, type DataItemProps } from '../../../../components';

type SupplierBarChartProps = {
    expenses: Array<ExpenseEntity>;
    className?: string;
    totalRegisteredSuppliers: number;
}

export default function SupplierInfo({ expenses, className, totalRegisteredSuppliers }: SupplierBarChartProps) {
    const router = useRouter();
    const data = React.useMemo(() => {
        const supplierMap = new Map<string, Omit<DataItemProps, 'color'>>();

        expenses.forEach((expense) => {
            const supplierId = expense.supplier.id;
            const supplierName = expense.supplier.name;

            if (supplierMap.has(supplierId)) {
                const current = supplierMap.get(supplierId)!;
                const currentCount = current?.count ?? 0
                supplierMap.set(supplierId, {
                    type: 'supplier',
                    name: supplierName,
                    value: current.value + expense.total,
                    count: currentCount + 1
                });
            } else {
                supplierMap.set(supplierId, {
                    type: 'supplier',
                    name: supplierName,
                    value: expense.total,
                    count: 1
                });
            }
        });

        return Array.from(supplierMap.values());
    }, [expenses]);


    return (
        <BarChart
            type="horizontal"
            title="Top 5 Suppliers"
            subtitle="Suppliers with the highest expenses"
            data={data}
            fallback="No expenses registered"
            className={className}
            tooltipContent={(params) => (<TooltipChart {...params} countText="Expenses" valueText="Total"/>)}
        >
            <Text variant="medium" color="neutral-80">
                {totalRegisteredSuppliers} registered suppliers
            </Text>
            <Button
                size="small"
                context="primary"
                onClick={() => router.push('/suppliers')}>
                Ver Detalhes
            </Button>
        </BarChart>
    );
}