import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useI18n } from '@repo/i18n';

import { BillEntity } from '@repo/business';

import { Button, Chart, type DataChartItem, Text } from '@repo/ds';

import { billBusiness, expenseBusiness } from '../../../../shared';

type BankInfoProps = {
    bills: Array<BillEntity>;
    className?: string;
    totalRegisteredBills: number;
}

export default function PaymentMethodsInfo({ bills, className, totalRegisteredBills }: BankInfoProps) {
    const { t } = useI18n();
    const router = useRouter();

    const list = billBusiness.mapBillListByFilter(bills, 'type');

    const data = useMemo(() => {
        const paymentMethodMap = new Map<string, Omit<DataChartItem, 'color'>>();
        list.forEach((item) => {
            const expenses = item.list.flatMap((bill) => bill.expenses).filter((expense) => expense !== undefined);
            const calculate = expenseBusiness.calculateAll(expenses);
            const paymentMethodName = item.title;
            if (paymentMethodMap.has(paymentMethodName)) {
                const current = paymentMethodMap.get(paymentMethodName);
                if (current) {
                    const currentCount = current?.count ?? 0;
                    paymentMethodMap.set(paymentMethodName, {
                        type: 'highlight',
                        name: paymentMethodName,
                        value: current.value + calculate.total,
                        count: currentCount + 1
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
        });

        return Array.from(paymentMethodMap.values());
    }, [list]);

    return (
        <Chart
            top={5}
            type="bar"
            data={data}
            title={`Top ${t('payment_methods')}`}
            subtitle={`${t('payment_methods')} ${t('with_the_highest_expenses')}`}
            fallback={t('no_payment_methods_registered')}
            className={className}
            wrapperType="card"
            chartTooltip={{
                countText: t('expenses'),
                valueText: 'Total'
            }}
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
        </Chart>
    );
}