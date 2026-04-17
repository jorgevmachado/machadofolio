import React ,{ useEffect ,useRef ,useState } from 'react';

import { Tabs } from '@repo/ds';

import type { Bill } from '@repo/business';

import { useBills } from '../../hooks';
import { type AllCalculatedSummary } from '../../types';

import Summary from '../summary';

import TabItem from './tab-item';

type BillTabProps = {
  list: Array<Bill>;
}

export default function Tab({ list }: BillTabProps) {
  const isMounted = useRef(false);
  const { getTitle, calculateAll, billListFilter } = useBills();

  const currentList = billListFilter(list, 'type');

  const [allCalculatedSummary, setAllCalculatedSummary] = useState<AllCalculatedSummary | undefined>(undefined);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      const allCalculatedSummary = calculateAll(list);
      setAllCalculatedSummary(allCalculatedSummary);
    }
  }, []);

  return (
    <>
      { allCalculatedSummary && (
        <Summary
          list={list}
          total={allCalculatedSummary.total}
          allPaid={allCalculatedSummary.allPaid}
          totalPaid={allCalculatedSummary.totalPaid}
          totalPending={allCalculatedSummary.totalPending}
        />
      )}
      <Tabs
        fluid
        items={currentList.map((item) => ({
          title: getTitle(item.title),
          children: (
            <TabItem list={item.list}/>),
        }))}
      />
    </>
  );
}