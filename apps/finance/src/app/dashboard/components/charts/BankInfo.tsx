import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useI18n } from '@repo/i18n';

import { BillEntity } from '@repo/business';

import { Button, Text } from '@repo/ds';

import { billBusiness, expenseBusiness } from '../../../../shared';
import { BarChart, TooltipChart, type DataItemProps } from '../../../../components';

type BankInfoProps = {
    bills: Array<BillEntity>;
    className?: string;
    totalRegisteredBanks: number;
}

export default function BankInfo({ bills, className, totalRegisteredBanks }: BankInfoProps) {
    const { t } = useI18n();
    const router = useRouter();

    const list = billBusiness.mapBillListByFilter(bills, 'bank');

    const data = useMemo(() => {
        const bankMap = new Map<string, Omit<DataItemProps, 'color'>>();
        list.forEach((item) => {
            const expenses = item.list.flatMap((bill) => bill.expenses).filter((expense) => expense !== undefined);
            const calculate = expenseBusiness.calculateAll(expenses);
            const bankName = item.title;
            if (bankMap.has(bankName)) {
                const current = bankMap.get(bankName);
                if (current) {
                    const currentCount = current?.count ?? 0;
                    bankMap.set(bankName, {
                        type: 'bank',
                        name: bankName,
                        value: current.value + calculate.total,
                        count: currentCount + 1
                    });
                }
            } else {
                bankMap.set(bankName, {
                    type: 'bank',
                    name: bankName,
                    value: calculate.total,
                    count: 1
                });
            }
        });

        return Array.from(bankMap.values());
    }, [list]);

    return (
        <BarChart
            type="horizontal"
            title={`Top ${t('banks')}`}
            subtitle={`${t('banks')} ${t('with_the_highest_expenses')}`}
            data={data}
            fallback={t('no_banks_registered')}
            className={className}
            tooltipContent={(params) => (<TooltipChart {...params} countText="Expenses" valueText="Total"/>)}
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
        </BarChart>
    );
}