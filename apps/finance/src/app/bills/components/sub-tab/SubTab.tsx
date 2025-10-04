import React, { useEffect, useState } from 'react';

import { snakeCaseToNormal } from '@repo/services';

import { Bill } from '@repo/business';

import { Tabs } from '@repo/ds';

import { billBusiness } from '../../../../shared';
import { ListCard } from '../index';
import CalculationSummary, { AllCalculatedSummary } from '../calculation-summary';

type SubTabProps = {
    list: Array<Bill>;
    handleOpenDeleteModal: (item?: Bill) => void;
};

export default function SubTab({ list, handleOpenDeleteModal }: SubTabProps) {
    const currentList = billBusiness.mapBillListByFilter(list, 'type');

    const [allCalculatedSummary, setAllCalculatedSummary] = useState<AllCalculatedSummary | undefined>(undefined);

    const billBusinessCalculatedAll = (bills: Array<Bill>) => {
        // AllCalculated expense
        // AllCalculated expense parent
        // AllCalculated expense children
        // AllCalculated expense bill
        return { total: 0, allPaid: false, totalPaid: 0, totalPending: 0 };
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
                    children: (<ListCard list={item.list} handleOpenDeleteModal={handleOpenDeleteModal}/>),
                }))}
            />
        </>
    );
}
