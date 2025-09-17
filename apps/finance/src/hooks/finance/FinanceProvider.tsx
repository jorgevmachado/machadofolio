import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Bank, Bill, Expense, Finance, FinanceInfo, Group, Supplier, SupplierType } from '@repo/business';

import { useLoading } from '@repo/ui';

import { financeService } from '../../shared';

import { FinanceContext, FinanceContextProps } from './FinanceContext';

export default function FinanceProvider({ children }: React.PropsWithChildren) {
    const isMounted = useRef(false);

    const { show, hide } = useLoading();
    const [financeInfo, setFinanceInfo] = useState<FinanceInfo | undefined>(undefined);
    const [fetchRefresh, setFetchRefresh] = useState<boolean>(false);

    const [banks, setBanks] = useState<Array<Bank>>([]);
    const [bills, setBills] = useState<Array<Bill>>([]);
    const [groups, setGroups] = useState<Array<Group>>([]);
    const [finance, setFinance] = useState<Finance | undefined>(undefined);
    const [expenses, setExpenses] = useState<Array<Expense>>([]);
    const [suppliers, setSuppliers] = useState<Array<Supplier>>([]);
    const [supplierTypes, setSupplierTypes] = useState<Array<SupplierType>>([]);

    const initializeFinanceInfo = (financeInfo: FinanceInfo) => {
        setFinanceInfo(financeInfo);
        setBills(financeInfo.bills);
        setBanks(financeInfo.banks);
        setGroups(financeInfo.groups);
        setFinance(financeInfo.finance);
        setSuppliers(financeInfo.suppliers);
        setSupplierTypes(financeInfo.supplierTypes);
    }

    const fetchFinanceInfo = useCallback(async () => {
        show()
        try {
            const response = await financeService.find();
            initializeFinanceInfo(response);
        } catch (error) {
            console.error('# => FinanceInfoProvider => fetchFinanceInfo => error => ', error);
        } finally {
            hide()
        }
    }, [show, hide]);

    const initialize = useCallback(async () => {
        show()
        try {
            const response = await financeService.initialize();
            setFinance(response)
        } catch (error) {
            console.error('# => FinanceInfoProvider => initializeFinance => error => ', error);
        } finally {
            hide()
        }
    }, [show, hide]);


    useEffect(() => {
        if(!isMounted.current) {
            isMounted.current = true;
            fetchFinanceInfo().then();
        }
    }, []);

    const fetch = useCallback(async () => {
        if(fetchRefresh) {
            await fetchFinanceInfo();
            setFetchRefresh(false);
        }
    }, [fetchRefresh, fetchFinanceInfo]);

    const context: FinanceContextProps = {
        total: financeInfo?.total ?? 0,
        fetch,
        banks,
        bills,
        groups,
        refresh: () => setFetchRefresh(true),
        allPaid: Boolean(financeInfo?.allPaid),
        finance,
        saveInfo: (financeInfo) => initializeFinanceInfo(financeInfo),
        expenses,
        totalPaid: financeInfo?.totalPaid ?? 0,
        suppliers,
        initialize,
        financeInfo,
        updateBills: (bills) => setBills(bills),
        updateBanks: (banks) => setBanks(banks),
        totalPending: financeInfo?.totalPending ?? 0,
        updateGroups: (groups) => setGroups(groups),
        updateFinance: (finance) => setFinance(finance),
        supplierTypes,
        updateExpenses: (expenses) => setExpenses(expenses),
        updateSuppliers: (suppliers) => setSuppliers(suppliers),
        updateSupplierTypes: (supplierTypes) => setSupplierTypes(supplierTypes)
    }

    return (
        <FinanceContext value={context}>
            {children}
        </FinanceContext>
    )
}