/**
 * Created by jorge.machado as 10/12/2025
 **/
import React ,{ useMemo } from 'react';

import { type BarChartProps ,Charts ,Text } from '@repo/ds';

import { useI18n } from '@repo/i18n';

type ChartFinanceInfoProps = {
  total: number;
  totalPaid: number;
  className?: string;
  totalPending: number;
  totalRegisteredExpenses: number;
}

export default function ChartFinanceInfo({ total, totalPaid, className, totalPending, totalRegisteredExpenses }: ChartFinanceInfoProps) {
  const { t } = useI18n();

  const barChart = useMemo(() => {
    const props: BarChartProps = {
      data: [],
      labels: []
    };

    if (total === 0 && totalPaid === 0 && totalPending === 0) {
      return props;
    }

    props.data = [
      {
        type: 'highlight',
        name: t('total'),
        value: Number(total.toFixed(2)),
        colorName: 'electric_blue'
      },
      {
        type: 'highlight',
        name: t('paid'),
        value: Number(totalPaid.toFixed(2)),
        colorName: 'emerald_green'
      },
      {
        type: 'highlight',
        name: t('pending'),
        value: Number(totalPending.toFixed(2)),
        colorName: 'intense_red'
      }
    ];
    props.labels = [{ key: 'value', fill: '#8b5cf6', labelList: { dataKey: 'value', position: 'top', withCurrencyFormatter: true } }];

    return props;
  }, [t]);

  return (
    <Charts
      type="bar"
      title={t('financial_overview')}
      tooltip={{
        valueProps: {
          show: true,
          text: t('value')
        }
      }}
      legend={{
        show: false,
      }}
      barChart={barChart}
      subtitle={t('comparison_between_total_values')}
      fallback={{ text: t('not_found_finance_info') }}
      className={className}
      withAxisCurrencyTickFormatter
    >
      <Text variant="medium" color="neutral-80">
        {totalRegisteredExpenses} {t('registered_expenses')}
      </Text>
    </Charts>
  );
}