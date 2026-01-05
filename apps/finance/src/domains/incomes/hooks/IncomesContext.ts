import React from 'react';

import { type IncomeSource } from '@repo/business';

import type { Income } from '@repo/business/finance/income/index';

import { type TableProps } from '../../../shared';

export type IncomesContextProps = {
  modal: React.ReactNode;
  headers: TableProps['headers'];
  incomes: Array<Income>;
  isLoading: boolean;
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
  isLoading: false ,
  incomeSources: [] ,
  currentFallback: undefined ,
  handleOpenPersistModal: () => {
  } ,
});