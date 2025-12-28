import { useMemo } from 'react';

import { type Bill } from '@repo/business';

import { Tabs } from '@repo/ds';

import { billBusiness } from '../../shared';

import OverviewBillsTab from './OverviewBillsTab';

type OverviewBillsProps = {
  bills: Array<Bill>
}

export default function OverviewBills({ bills }: OverviewBillsProps) {

  const groups = useMemo(() => {
    return billBusiness.mapBillListByFilter(bills ,'group');
  }, [bills]);



  return (
    <Tabs fluid items={ groups.map((item) => ({
      title: item.title ,
      children: <OverviewBillsTab key={`${item.title}-overview`} list={ item.list}/> ,
    })) }/>
  );
}