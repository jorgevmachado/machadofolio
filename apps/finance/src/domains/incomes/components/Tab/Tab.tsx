import React from 'react';

import { type Income } from '@repo/business';

import { Table } from '@repo/ds';

import { useIncomes } from '../../hooks';

type TabProps = {
  income: Income
}

export default function Tab({ income }: TabProps) {

  const { headers ,isLoading , tableItem,  handleOpenPersistModal } = useIncomes();

  return (
    <div>
      <Table
        headers={ headers }
        items={ tableItem(income) }
        onRowClick={ (item) => handleOpenPersistModal(
          item as Income ,
        ) }
        loading={ isLoading }
      />
    </div>
  );
}