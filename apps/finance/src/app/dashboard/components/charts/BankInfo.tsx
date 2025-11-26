import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useI18n } from '@repo/i18n';

import { BillEntity } from '@repo/business';

import { Button, Charts, Text, type BarChartProps, type TooltipProps } from '@repo/ds';

import { billBusiness, expenseBusiness } from '../../../../shared';

type BankInfoProps = {
    bills: Array<BillEntity>;
    className?: string;
    totalRegisteredBanks: number;
}

export default function BankInfo({ bills, className, totalRegisteredBanks }: BankInfoProps) {
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
        const props: BarChartProps = {
            top: 5,
            data,
            labels: [{ key: 'value', fill: '#FFF', activeBar: { type: 'rectangle' } }],
        }
        return props;
    }, [list])

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
        }
        return props;
    }, [t])

    return (
        <Charts
            type="bar"
            title={`Top 5 ${t('banks')}`}
            layout="horizontal"
            fallback={{
                text: t('no_banks_registered'),
                action: {
                    size: 'small',
                    onClick: () => router.push('/banks'),
                    context: 'primary',
                    children: `${t('create_new')} ${t('bank')}`
                }
            }}
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