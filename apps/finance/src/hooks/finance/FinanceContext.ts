import React from 'react';

import { FinanceInfo } from '@repo/business';

export type FinanceContextProps = {
    total: number;
    fetch: () => Promise<void>;
    bills: FinanceInfo['bills'];
    banks: FinanceInfo['banks'];
    groups: FinanceInfo['groups'];
    refresh: () => void;
    allPaid: boolean;
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
    updateFinance: (finance: FinanceInfo['finance']) => void;
    supplierTypes: FinanceInfo['supplierTypes'];
    updateExpenses: (expenses: FinanceInfo['expenses']) => void;
    updateSuppliers: (suppliers: FinanceInfo['suppliers']) => void;
    updateSupplierTypes: (supplierTypes: FinanceInfo['supplierTypes']) => void;
};

export const FinanceContext = React.createContext<FinanceContextProps>({
    total: 0,
    fetch: () => Promise.resolve(),
    banks: [],
    bills: [],
    groups: [],
    refresh: () => {},
    allPaid: false,
    finance: undefined,
    saveInfo: () => {},
    expenses: [],
    totalPaid: 0,
    suppliers: [],
    initialize: () => Promise.resolve(),
    updateBills: () => {},
    updateBanks: () => {},
    totalPending: 0,
    updateGroups: () => {},
    updateFinance: () => {},
    supplierTypes: [],
    updateExpenses: () => {},
    updateSuppliers: () => {},
    updateSupplierTypes: () => {},
});