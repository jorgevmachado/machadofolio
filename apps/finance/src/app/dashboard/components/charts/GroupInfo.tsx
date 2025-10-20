import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useI18n } from '@repo/i18n';

import { BillEntity } from '@repo/business';

import { Button, Text } from '@repo/ds';

import { billBusiness, expenseBusiness } from '../../../../shared';
import { BarChart, TooltipChart, type DataItemProps } from '../../../../components';

type GroupInfoProps = {
    bills: Array<BillEntity>;
    className?: string;
    totalRegisteredGroups: number;
}

export default function GroupInfo({ bills, className, totalRegisteredGroups }: GroupInfoProps) {
    const { t } = useI18n();
    const router = useRouter();

    const list = billBusiness.mapBillListByFilter(bills, 'group');

    const data = useMemo(() => {
        const groupMap = new Map<string, Omit<DataItemProps, 'color'>>();
        list.forEach((item) => {
            const expenses = item.list.flatMap((bill) => bill.expenses).filter((expense) => expense !== undefined);
            const calculate = expenseBusiness.calculateAll(expenses);
            const groupName = item.title;
            if (groupMap.has(groupName)) {
                const current = groupMap.get(groupName);
                if (current) {
                    const currentCount = current?.count ?? 0;
                    groupMap.set(groupName, {
                        type: 'group',
                        name: groupName,
                        value: current.value + calculate.total,
                        count: currentCount + 1
                    });
                }
            } else {
                groupMap.set(groupName, {
                    type: 'group',
                    name: groupName,
                    value: calculate.total,
                    count: 1
                });
            }
        });

        return Array.from(groupMap.values());
    }, [list]);

    return (
        <BarChart
            type="horizontal"
            title={`Top ${t('groups')}`}
            subtitle={`${t('groups')} ${t('with_the_highest_expenses')}`}
            data={data}
            fallback={`${t('no_groups_registered')}`}
            className={className}
            tooltipContent={(params) => (<TooltipChart {...params} countText="Expenses" valueText="Total"/>)}
        >
            <Text variant="medium" color="neutral-80">
                {totalRegisteredGroups} {t('registered_groups')}
            </Text>
            <Button
                size="small"
                context="primary"
                onClick={() => router.push('/groups')}>
                {t('view_details')}
            </Button>
        </BarChart>
    );
}