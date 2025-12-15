/**
 * Created by jorge.machado as 10/12/2025
 **/
import React ,{ useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { convertToNumber } from '@repo/services';

import {
  type BarChartProps ,
  Button ,
  Charts ,
  Text ,
  type TooltipProps,
} from '@repo/ds';

import type { BillEntity } from '@repo/business';
import { useI18n } from '@repo/i18n';

import { billBusiness ,expenseBusiness } from '../../shared';

type ChartProps = React.ComponentProps<typeof Charts>;

type ChartGroupInfoProps = {
  bills: Array<BillEntity>;
  className?: string;
  totalRegisteredGroups: number;
}

export default function ChartGroupInfo({ bills, className, totalRegisteredGroups }: ChartGroupInfoProps) {
  const { t } = useI18n();
  const router = useRouter();

  const list = billBusiness.mapBillListByFilter(bills, 'group');

  const barChart = useMemo(() => {
    const groupMap = new Map<string, BarChartProps['data'][number]>();
    list.forEach((item, index) => {
      const expenses = item.list.flatMap((bill) => bill.expenses).filter((expense) => expense !== undefined);
      const calculate = expenseBusiness.calculateAll(expenses);
      const groupName = item.title;
      if (groupMap.has(groupName)) {
        const current = groupMap.get(groupName);
        if (current) {
          const value = convertToNumber(current?.value);
          const count = convertToNumber(current?.count);
          groupMap.set(groupName, {
            type: 'highlight',
            name: groupName,
            value: value + calculate.total,
            count: count + 1
          });
        }
      } else {
        groupMap.set(groupName, {
          type: 'highlight',
          name: groupName,
          index,
          value: calculate.total,
          count: 1
        });
      }
    });

    const array = Array.from(groupMap.values());

    const data = array
      .sort((a, b) => {
        const bValue = convertToNumber(b.value);
        const aValue = convertToNumber(a.value);
        return bValue - aValue!;
      }).map((item) => ({
        ...item,
        name: t(item.name)
      }));

    const nonZeroValues = data.some(item => item.value !== 0);

    const props: BarChartProps = {
      top: 5,
      data: nonZeroValues ? data : [],
      labels: [{ key: 'value', fill: '#808080' }],
    };
    return props;
  }, [list, t]);

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
    if (totalRegisteredGroups > 0 && bills.length > 0) {
      return `Top 5 ${t('groups')}`;
    }
    return t('groups');
  }, [bills.length, t, totalRegisteredGroups]);

  const fallback = useMemo(() => {
    const text = totalRegisteredGroups > 0
      ? `${totalRegisteredGroups} ${t('registered_groups')}`
      :  t('no_groups_registered');

    const children = totalRegisteredGroups > 0
      ? t('view_details')
      :  `${t('create_new')} ${t('group')}`;
    const defaultFallback: ChartProps['fallback'] = {
      text,
      action: {
        size: 'small',
        onClick: () => router.push('/groups'),
        context: 'primary',
        children
      }
    };
    return defaultFallback;
  }, [router, t, totalRegisteredGroups]);

  return (
    <Charts
      type="bar"
      title={title}
      layout="horizontal"
      legend={{ show: false }}
      subtitle={`${t('groups')} ${t('with_the_highest_expenses')}`}
      fallback={fallback}
      className={className}
      barChart={barChart}
      tooltip={tooltip}
      wrapperType="card"
      withAxisCurrencyTickFormatter
    >
      <Text variant="medium" color="neutral-80">
        {totalRegisteredGroups} {t('registered')} {t('groups')}
      </Text>
      <Button
        size="small"
        context="primary"
        onClick={() => router.push('/groups')}>
        {t('view_details')}
      </Button>
    </Charts>
  );
}