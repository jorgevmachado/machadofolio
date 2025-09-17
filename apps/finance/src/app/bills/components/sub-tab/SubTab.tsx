import React from 'react';

import { snakeCaseToNormal } from '@repo/services';

import { Bill } from '@repo/business';

import { Tabs } from '@repo/ds';

import { billBusiness } from '../../../../shared';
import { ListCard } from '../index';

type SubTabProps = {
    list: Array<Bill>;
    handleOpenDeleteModal: (item?: Bill) => void;
};

export default function SubTab({ list, handleOpenDeleteModal }: SubTabProps) {
    const currentList = billBusiness.mapBillListByFilter(list, 'type');

    return (
        <Tabs
            fluid
            items={currentList.map((item) => ({
                title: snakeCaseToNormal(item.title),
                children: (<ListCard list={item.list} handleOpenDeleteModal={handleOpenDeleteModal}/>),
            }))}
        />
    );
}
