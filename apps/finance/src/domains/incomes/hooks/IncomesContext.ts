import React from 'react';

import {
  type Income,
  type IncomeSource ,
  type IncomeWithMonthsAndPaid,
} from '@repo/business';

import { type TableProps } from '../../../shared';

export type IncomesContextProps = {
  modal: React.ReactNode;
  headers: TableProps['headers'];
  incomes: Array<Income>;
  allPaid:  boolean;
  allTotal:  string;
  isLoading: boolean;
  tableItem: (income: Income) => Array<IncomeWithMonthsAndPaid>
  incomeSources: Array<IncomeSource>;
  currentFallback?: {
    button?: {
      label: string;
      onClick: () => void;
    };
    message: {
      text: string;
    };
  };
  handleOpenPersistModal: (income?: Income) => void;
}

export const IncomesContext = React.createContext<IncomesContextProps>({
  modal: null ,
  headers: [] ,
  incomes: [] ,
  allPaid: false ,
  allTotal: 'R$ 0' ,
  isLoading: false ,
  tableItem: () => [],
  incomeSources: [] ,
  currentFallback: undefined ,
  handleOpenPersistModal: () => {
  } ,
});