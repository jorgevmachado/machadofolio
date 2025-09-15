'use client'
import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Bank, Bill, type BillList, Group, Supplier } from '@repo/business';

import { Tabs } from '@repo/ds';

import { useAlert, useLoading } from '@repo/ui';

import { DependencyFallback, PageHeader } from '../../components';

import { bankService, billBusiness, billService, groupService, supplierService } from '../shared';

import { SubTab } from './components';

export default function BillsPage() {
    const isMounted = useRef(false);
    const router = useRouter();

    const [banks, setBanks] = useState<Array<Bank>>([]);
    const [groups, setGroups] = useState<Array<Group>>([]);
    const [suppliers, setSuppliers] = useState<Array<Supplier>>([]);
    const [hasAllDependencies, setHasAllDependencies] = useState<boolean>(false);
    const [billListGroup, setBillListGroup] = useState<Array<BillList>>([]);


    const { show, hide, isLoading } = useLoading();
    const { addAlert } = useAlert();

    const fetchAllDependencies = async () => {
        show();
        try {
            const [ responseBanks, responseGroups, responseSuppliers ] = await Promise.all([
                banks.length === 0 ? await bankService.getAll({}) as Array<Bank> : banks,
                groups.length === 0 ? await groupService.getAll({})  as Array<Group> : groups,
                suppliers.length === 0 ? await supplierService.getAll({})  as Array<Supplier> : suppliers,
            ]);
            setBanks(responseBanks);
            setGroups(responseGroups);
            setSuppliers(responseSuppliers);
        } catch (error) {
            console.error('# => BillsPage => fetchAllDependencies => error => ',error)
            addAlert({
                type: 'error',
                message: `Error fetching dependencies for Bills.`,
            });
        } finally {
            hide();
        }
    }

    const fetchItems = async () => {
        show()
        try {
            const response = await billService.getAll({ withRelations: true })  as Array<Bill>;
            const billListGroup = billBusiness.mapBillListByFilter(response, 'group');
            setBillListGroup(billListGroup);
        } catch (error) {
            console.error('# => BillsPage => fetchItems => error => ',error)
            addAlert({
                type: 'error',
                message: `Error fetching Bills.`,
            });
        } finally {
            hide();
        }
    }

    useEffect(() => {
        if(!isMounted.current) {
            isMounted.current = true;
            fetchAllDependencies();
            fetchItems();
        }
    }, []);

    useEffect(() => {
        setHasAllDependencies(banks.length > 0 && groups.length > 0 && suppliers.length > 0);
    }, [banks, groups, suppliers]);

    return !isLoading  ? (
        <>
            <PageHeader resourceName="Bill" action={{
                label: 'Create New Bill',
                onClick: () => router.push('/bills/create'),
                disabled: !hasAllDependencies,
            }}/>
            {groups.length === 0 && (
                <DependencyFallback
                    message="No groups were found. Please create a group before creating a bill."
                    button={{
                        label: 'Create Group',
                        onClick: () => router.push('/groups'),
                    }}
                />
            )}
            {banks.length === 0 && (
                <DependencyFallback
                    message="No banks were found. Please create a bank before creating a bill."
                    button={{
                        label: 'Create Bank',
                        onClick: () => router.push('/banks'),
                    }}
                />
            )}
            {suppliers.length === 0 && (
                <DependencyFallback
                    message="No suppliers were found. Please create a supplier before creating a bill."
                    button={{
                        label: 'Create Supplier',
                        onClick: () => router.push('/suppliers'),
                    }}
                />
            )}
            {billListGroup.length === 0 ? (
                <DependencyFallback message="No bills were found."/>
            ) : (
                <Tabs fluid items={billListGroup.map((item) => ({
                    title: item.title,
                    children: <SubTab key={item.title} list={item.list} suppliers={suppliers}/>,
                }))}/>
            )}
        </>
    ) : null;
}