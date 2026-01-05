import React from 'react';

import { type Income } from '@repo/business';

import { Table } from '@repo/ds';

import { monthBusiness } from '../../../../shared';
import { useIncomes } from '../../hooks';

type TabProps = {
  income: Income
}

export default function Tab({ income }: TabProps) {

  const { headers ,isLoading ,handleOpenPersistModal } = useIncomes();

  const generateIncomeWithMonthsAndPaid = (income: Income) => {
    const objectMonths = monthBusiness.convertMonthsToObject(income.months);
    const calculateMonths = monthBusiness.calculateAll(income?.months);
    return [
      {
        ...objectMonths ,
        ...income ,
        total: calculateMonths.total,
      }];
  };
  return (
    <div>
      <Table
        headers={ headers }
        items={ generateIncomeWithMonthsAndPaid(income) }
        onRowClick={ (item) => handleOpenPersistModal(
          item as Income,
        ) }
        loading={ isLoading }
      />
    </div>
  );
}