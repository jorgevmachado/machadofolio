'use client';
import React  from 'react';

import { IncomeContent ,IncomesProvider } from '../../domains/incomes';

export default function IncomesPage() {

  return (
    <IncomesProvider>
      <IncomeContent/>
    </IncomesProvider>
  );
}