import React from 'react';

import { snakeCaseToNormal } from '@repo/services';

import { Bill, Supplier } from '@repo/business';

import { Tabs } from '@repo/ds';

import { billBusiness } from '../../../shared';
import { ListCard } from '../index';

type SubTabProps = {
    list: Array<Bill>;
    suppliers: Array<Supplier>;
};

export default function SubTab({ list, suppliers }: SubTabProps) {
    const currentList = billBusiness.mapBillListByFilter(list, 'type');

    return (
        <Tabs
            fluid
            items={currentList.map((item) => ({
                title: snakeCaseToNormal(item.title),
                children: (
                    <ListCard list={item.list} suppliers={suppliers} />
                ),
            }))}
        />
    );
}
