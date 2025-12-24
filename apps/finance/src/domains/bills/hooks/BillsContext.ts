import React from 'react';

import type {
  Bill ,
  BillList ,
  FinanceInfo ,
  MonthsCalculated,
} from '@repo/business';
import type { I18nTFunction } from '@repo/i18n';

export type BillsContextProps = {
  t: I18nTFunction;
  modal: React.ReactNode;
  bills: FinanceInfo['bills'];
  banks: FinanceInfo['banks'];
  groups: FinanceInfo['groups'];
  billList: Array<BillList>;
  getTitle: (title: string) => string;
  suppliers: FinanceInfo['suppliers'];
  isLoading: boolean;
  fetchBill: () => Promise<void>;
  calculateAll: (bills: Array<Bill>) => MonthsCalculated;
  billListFilter: (list: Array<Bill>, type: BillList['type']) => Array<BillList>;
  hasAllDependencies: boolean;
  handleOpenDeleteModal: (item?: Bill) => void;
  handleUploadsFileModal: () => void;
  handleUploadFilesModal: (item: Bill) => void;
  handleOpenPersistModal: (item?: Bill) => void;

};

export const BillsContext = React.createContext<BillsContextProps>({
  t: ((key: string) => key) as I18nTFunction,
  modal: null,
  bills: [],
  banks: [],
  groups: [],
  billList: [],
  getTitle: (title: string) => title,
  suppliers: [],
  isLoading: false,
  fetchBill: () => Promise.resolve(),
  calculateAll: () => ({ total: 0, allPaid: true, totalPaid: 0, totalPending: 0 } as MonthsCalculated),
  billListFilter: () => [],
  hasAllDependencies: false,
  handleOpenDeleteModal: () => {},
  handleUploadsFileModal: () => {},
  handleUploadFilesModal: () => {},
  handleOpenPersistModal: () => {},
});