import React ,{ useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { type BarChartProps ,Button ,Charts ,Text ,type TooltipProps } from '@repo/ds';

import type { BillEntity } from '@repo/business';
import { useI18n } from '@repo/i18n';

import { billBusiness ,expenseBusiness } from '../../shared';

type ChartProps = React.ComponentProps<typeof Charts>;

type ChartBankInfoProps = {
  bills: Array<BillEntity>;
  className?: string;
  totalRegisteredBanks: number;
}

export default function ChartBankInfo({ bills, className, totalRegisteredBanks }: ChartBankInfoProps) {
  const { t } = useI18n();
  const router = useRouter();

  const list = billBusiness.mapBillListByFilter(bills, 'bank');

  const barChart = useMemo(() => {
    const bankMap = new Map<string, BarChartProps['data'][number]>();
    list.forEach((item, index) => {
      const expenses = item.list.flatMap((bill) => bill.expenses).filter((expense) => expense !== undefined);
      const calculate = expenseBusiness.calculateAll(expenses);
      const bankName = item.title;
      if (bankMap.has(bankName)) {
        const current = bankMap.get(bankName);
        if (current) {
          bankMap.set(bankName, {
            type: 'bank',
            name: bankName,
            value: calculate.total,
            count: index + 1
          });
        }
      } else {
        bankMap.set(bankName, {
          type: 'bank',
          name: bankName,
          value: calculate.total,
          count: index + 1
        });
      }
    });
    const data = Array.from(bankMap.values());
    const nonZeroValues = data.some(item => item.value !== 0);

    const props: BarChartProps = {
      top: 5,
      data: [],
      labels: [{ key: 'value', fill: '#FFF', activeBar: { type: 'rectangle' } }],
    };


    if (nonZeroValues) {
      props.data = data;
    }
    return props;
  }, [list]);

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

  const title = useMemo(() => {
    if (totalRegisteredBanks > 0 && bills.length > 0) {
      return `Top 5 ${t('banks')}`;
    }
    return t('banks');
  }, [bills.length, t, totalRegisteredBanks]);

  const fallback = useMemo(() => {
    const text = totalRegisteredBanks > 0
      ? `${totalRegisteredBanks} ${t('registered_banks')}`
      :  t('no_banks_registered');

    const children = totalRegisteredBanks > 0
      ? t('view_details')
      :  `${t('create_new')} ${t('bank')}`;
    const defaultFallback: ChartProps['fallback'] = {
      text,
      action: {
        size: 'small',
        onClick: () => router.push('/banks'),
        context: 'primary',
        children
      }
    };
    return defaultFallback;
  }, [router, t, totalRegisteredBanks]);

  return (
    <Charts
      type="bar"
      title={title}
      layout="horizontal"
      fallback={fallback}
      legend={{ show: false }}
      subtitle={`${t('banks')} ${t('with_the_highest_expenses')}`}
      className={className}
      barChart={barChart}
      tooltip={tooltip}
      wrapperType="card"
      withAxisCurrencyTickFormatter
    >
      <Text variant="medium" color="neutral-80">
        {totalRegisteredBanks} {t('registered_banks')}
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