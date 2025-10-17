import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

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
            title="Top Groups"
            subtitle="Groups with the highest expenses"
            data={data}
            fallback="No groups registered"
            className={className}
            tooltipContent={(params) => (<TooltipChart {...params} countText="Expenses" valueText="Total"/>)}
        >
            <Text variant="medium" color="neutral-80">
                {totalRegisteredGroups} registered groups
            </Text>
            <Button
                size="small"
                context="primary"
                onClick={() => router.push('/groups')}>
                Ver Detalhes
            </Button>
        </BarChart>
    );
}