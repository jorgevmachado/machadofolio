import React from 'react';

import { type Expense ,type FinanceInfo } from '@repo/business';

export type ExpensesCache = {
  [key: string]: {
    results: Array<Expense>;
    totalPages: number;
    billVersion: string;
  };
};

export type FinanceContextProps = {
  total: number;
  fetch: () => Promise<void>;
  bills: FinanceInfo['bills'];
  banks: FinanceInfo['banks'];
  groups: FinanceInfo['groups'];
  refresh: () => void;
  allPaid: boolean;
  incomes: FinanceInfo['incomes'];
  finance?: FinanceInfo['finance'];
  saveInfo: (info: FinanceInfo) => void;
  expenses: FinanceInfo['expenses'];
  totalPaid: number;
  suppliers: FinanceInfo['suppliers'];
  initialize: () => Promise<void>;
  financeInfo?: FinanceInfo;
  updateBills: (bills: FinanceInfo['bills']) => void;
  updateBanks: (banks: FinanceInfo['banks']) => void;
  totalPending: number;
  updateGroups: (groups: FinanceInfo['groups']) => void;
  expensesCache: ExpensesCache;
  updateFinance: (finance: FinanceInfo['finance']) => void;
  supplierTypes: FinanceInfo['supplierTypes'];
  incomeSources: FinanceInfo['incomeSources'];
  updateExpenses: (expenses: FinanceInfo['expenses']) => void;
  updateSuppliers: (suppliers: FinanceInfo['suppliers']) => void;
  updateIncomes: (incomes: FinanceInfo['incomes']) => void;
  setExpensesCache: React.Dispatch<React.SetStateAction<ExpensesCache>>;
  hasAllDependencies: boolean;
  updateSupplierTypes: (supplierTypes: FinanceInfo['supplierTypes']) => void;
  updateIncomeSources: (incomeSources: FinanceInfo['incomeSources']) => void;

};

export const FinanceContext = React.createContext<FinanceContextProps>({
  total: 0 ,
  fetch: () => Promise.resolve() ,
  banks: [] ,
  bills: [] ,
  groups: [] ,
  refresh: () => {
  } ,
  allPaid: false ,
  finance: undefined ,
  saveInfo: () => {
  } ,
  incomes: [],
  expenses: [] ,
  totalPaid: 0 ,
  suppliers: [] ,
  initialize: () => Promise.resolve() ,
  updateBills: () => {
  } ,
  updateBanks: () => {
  } ,
  totalPending: 0 ,
  updateGroups: () => {
  } ,
  expensesCache: {} ,
  updateFinance: () => {
  } ,
  supplierTypes: [] ,
  updateIncomes: () => {},
  updateExpenses: () => {
  } ,
  incomeSources: [] ,
  updateSuppliers: () => {
  } ,
  setExpensesCache: () => {
  } ,
  hasAllDependencies: false ,
  updateSupplierTypes: () => {
  } ,
  updateIncomeSources: () => {},
});