import React, { useEffect, useState } from 'react';

import { snakeCaseToNormal } from '@repo/services';

import { Bill } from '@repo/business';

import { Tabs } from '@repo/ds';

import { billBusiness, expenseBusiness } from '../../../../shared';
import { ListCard } from '../index';
import CalculationSummary, { AllCalculatedSummary } from '../calculation-summary';

type SubTabProps = {
    list: Array<Bill>;
    handleOpenDeleteModal: (item?: Bill) => void;
    handleUploadFileModal: (item: Bill) => void;
};

export default function SubTab({ list, handleOpenDeleteModal, handleUploadFileModal }: SubTabProps) {
    const currentList = billBusiness.mapBillListByFilter(list, 'type');

    const [allCalculatedSummary, setAllCalculatedSummary] = useState<AllCalculatedSummary | undefined>(undefined);

    const billBusinessCalculatedAll = (bills: Array<Bill>) => {
        return bills.reduce((acc, bill) => {
            if(!bill?.expenses || !bill?.expenses?.length) {
                return acc;
            }
            const expenses = bill.expenses.map((expense) => expenseBusiness.calculate(expense));
            const expensesCalculated = expenseBusiness.calculateAll(expenses);
            acc.total = acc.total + expensesCalculated.total;
            acc.allPaid = acc.allPaid && expensesCalculated.allPaid;
            acc.totalPaid = acc.totalPaid + expensesCalculated.totalPaid;
            acc.totalPending = acc.totalPending + expensesCalculated.totalPending;
            return acc;
        }, { total: 0, allPaid: true, totalPaid: 0, totalPending: 0 } as AllCalculatedSummary);
    }

    useEffect(() => {
        const allCalculatedSummary = billBusinessCalculatedAll(list);
        setAllCalculatedSummary(allCalculatedSummary);
    }, [list]);

    return (
        <>
            { allCalculatedSummary && (
                <CalculationSummary
                    total={allCalculatedSummary.total}
                    allPaid={allCalculatedSummary.allPaid}
                    totalPaid={allCalculatedSummary.totalPaid}
                    totalPending={allCalculatedSummary.totalPending}
                />
            )}
            <Tabs
                fluid
                items={currentList.map((item) => ({
                    title: snakeCaseToNormal(item.title),
                    children: (<ListCard list={item.list} handleOpenDeleteModal={handleOpenDeleteModal} handleUploadFileModal={handleUploadFileModal}/>),
                }))}
            />
        </>
    );
}
