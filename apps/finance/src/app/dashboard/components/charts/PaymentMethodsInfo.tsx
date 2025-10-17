import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { BillEntity } from '@repo/business';

import { Button, Text } from '@repo/ds';

import { billBusiness, expenseBusiness } from '../../../../shared';
import { BarChart, TooltipChart, type DataItemProps } from '../../../../components';

type BankInfoProps = {
    bills: Array<BillEntity>;
    className?: string;
    totalRegisteredBills: number;
}

export default function PaymentMethodsInfo({ bills, className, totalRegisteredBills }: BankInfoProps) {
    const router = useRouter();

    const list = billBusiness.mapBillListByFilter(bills, 'type');

    const data = useMemo(() => {
        const paymentMethodMap = new Map<string, Omit<DataItemProps, 'color'>>();
        list.forEach((item) => {
            const expenses = item.list.flatMap((bill) => bill.expenses).filter((expense) => expense !== undefined);
            const calculate = expenseBusiness.calculateAll(expenses);
            const paymentMethodName = item.title;
            if (paymentMethodMap.has(paymentMethodName)) {
                const current = paymentMethodMap.get(paymentMethodName);
                if (current) {
                    const currentCount = current?.count ?? 0;
                    paymentMethodMap.set(paymentMethodName, {
                        type: 'payment-method',
                        name: paymentMethodName,
                        value: current.value + calculate.total,
                        count: currentCount + 1
                    });
                }
            } else {
                paymentMethodMap.set(paymentMethodName, {
                    type: 'payment-method',
                    name: paymentMethodName,
                    value: calculate.total,
                    count: 1
                });
            }
        });

        return Array.from(paymentMethodMap.values());
    }, [list]);

    return (
        <BarChart
            type="horizontal"
            title="Top Payment Methods"
            subtitle="Payment Methods with the highest expenses"
            data={data}
            fallback="No Payment Methods registered"
            className={className}
            tooltipContent={(params) => (<TooltipChart {...params} countText="Expenses" valueText="Total"/>)}
        >
            <Text variant="medium" color="neutral-80">
                {totalRegisteredBills} registered bills
            </Text>
            <Button
                size="small"
                context="primary"
                onClick={() => router.push('/bills')}>
                Ver Detalhes
            </Button>
        </BarChart>
    );
}