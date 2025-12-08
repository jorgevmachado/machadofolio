'use client';
import React, { useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { convertToNumber } from '@repo/services';

import { type BarChartProps, Button, Charts, Text, type TooltipProps } from '@repo/ds';

import type { ExpenseEntity } from '@repo/business';
import { useI18n } from '@repo/i18n';

type ChartProps = React.ComponentProps<typeof Charts>;

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
      const result = { name: supplierName };
      const split = supplierName.split('-');
      if (split && split.length > 1) {
        result.name = split?.[0]?.trim() ?? supplierName;
      }
      if (supplierMap.has(supplierId)) {
        const current = supplierMap.get(supplierId);
        if (current) {
          const value = convertToNumber(current?.value);
          const count = convertToNumber(current?.count);
          supplierMap.set(supplierId, {
            type: 'highlight',
            name: result.name,
            index,
            value: value + expense.total,
            count: count + 1
          });
        }
      } else {
        supplierMap.set(supplierId, {
          type: 'highlight',
          name: result.name,
          index,
          value: expense.total,
          count: 1
        });
      }
    });

    const array = Array.from(supplierMap.values());

    const data = array
      .sort((a, b) => {
        const bValue = convertToNumber(b.value);
        const aValue = convertToNumber(a.value);
        return bValue - aValue!;
      }).map((item) => ({
        ...item,
        name: t(item.name)
      }));

    const props: BarChartProps = {
      top: 5,
      data,
      labels: [{ key: 'value', fill: '#808080' }],
    };
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
    };
    return props;
  }, [t]);
  
  const title = useMemo(() => {
    if (totalRegisteredSuppliers > 0 && expenses.length > 0) {
      return `Top 5 ${t('suppliers')}`;
    }
    return t('suppliers');
  }, [expenses.length, t, totalRegisteredSuppliers]);

  const fallback = useMemo(() => {
    const text = totalRegisteredSuppliers > 0
      ? `${totalRegisteredSuppliers} ${t('registered_suppliers')}`
      :  t('no_suppliers_registered');

    const children = totalRegisteredSuppliers > 0
      ? t('view_details')
      :  `${t('create_new')} ${t('subblier')}`;
    const defaultFallback: ChartProps['fallback'] = {
      text,
      action: {
        size: 'small',
        onClick: () => router.push('/suppliers'),
        context: 'primary',
        children
      }
    };
    return defaultFallback;
  }, [router, t, totalRegisteredSuppliers]);


  return (
    <Charts
      type="bar"
      title={title}
      layout="horizontal"
      legend={{ show: false }}
      subtitle={`${t('suppliers')} ${t('with_the_highest_expenses')}`}
      fallback={fallback}
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
        onClick={() => router.push('/suppliers')}>
        {t('view_details')}
      </Button>
    </Charts>
  );
}