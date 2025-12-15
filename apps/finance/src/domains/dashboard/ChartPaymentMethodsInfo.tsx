/**
 * Created by jorge.machado as 10/12/2025
 **/
import React ,{ useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { convertToNumber } from '@repo/services';

import { type BarChartProps ,Button ,Charts ,Text ,type TooltipProps } from '@repo/ds';

import type { BillEntity } from '@repo/business';
import { useI18n } from '@repo/i18n';

import { billBusiness ,expenseBusiness } from '../../shared';

type ChartPaymentMethodsInfoProps = {
  bills: Array<BillEntity>;
  className?: string;
  totalRegisteredBills: number;
}

export default function ChartPaymentMethodsInfo({ bills, className, totalRegisteredBills }: ChartPaymentMethodsInfoProps) {
  const { t } = useI18n();
  const router = useRouter();

  const list = billBusiness.mapBillListByFilter(bills, 'type');

  const tooltip = useMemo(() => {
    const props: TooltipProps = {
      countProps: {
        show: true,
        text: t('expenses'),
      },
      valueProps: {
        show: true,
        text: 'Total',
        withCurrencyFormatter: true
      }
    };
    return props;
  }, [t]);

  const barChart = useMemo(() => {
    const paymentMethodMap = new Map<string, BarChartProps['data'][number]>();

    for (const item of list) {
      const expenses = item.list.flatMap((bill) => bill.expenses).filter((expense) => expense !== undefined);
      const calculate = expenseBusiness.calculateAll(expenses);
      const paymentMethodName = item.title;
      if (paymentMethodMap.has(paymentMethodName)) {
        const current = paymentMethodMap.get(paymentMethodName);
        if (current) {
          const value = convertToNumber(current?.value);
          const count = convertToNumber(current?.count);
          paymentMethodMap.set(paymentMethodName, {
            type: 'highlight',
            name: paymentMethodName,
            value: value + calculate.total,
            count: count + 1
          });
        }
      } else {
        paymentMethodMap.set(paymentMethodName, {
          type: 'highlight',
          name: paymentMethodName,
          value: calculate.total,
          count: 1
        });
      }
    }

    const data = Array.from(paymentMethodMap.values());

    const props: BarChartProps = {
      top: 5,
      data: data.map((item) => ({
        ...item,
        name: t(item.name)
      })).filter((item) => item.value as number > 0),
      labels: [{ key: 'value', fill: '#808080' }],
    };
    return props;
  }, [list, t]);

  return (
    <Charts
      type="bar"
      title={`Top ${t('payment_methods')}`}
      layout="horizontal"
      legend={{ show: false }}
      subtitle={`${t('payment_methods')} ${t('with_the_highest_expenses')}`}
      fallback={{ text: t('no_payment_methods_registered') }}
      className={className}
      barChart={barChart}
      tooltip={tooltip}
      wrapperType="card"
      withAxisCurrencyTickFormatter
    >
      <Text variant="medium" color="neutral-80">
        {totalRegisteredBills} {t('registered_bills')}
      </Text>
      <Button
        size="small"
        context="primary"
        onClick={() => router.push('/bills')}>
        {t('view_details')}
      </Button>
    </Charts>
  );
}