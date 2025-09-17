'use client'
import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Bank, Bill, type BillList, CreateBillParams, Group, Supplier } from '@repo/business';

import { Tabs } from '@repo/ds';

import { useAlert, useLoading, useModal } from '@repo/ui';

import { DependencyFallback, ModalDelete, PageHeader } from '../../components';

import { bankService, billBusiness, billService, groupService, supplierService } from '../shared';

import { Persist, SubTab } from './components';

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
    const { openModal, modal, closeModal } = useModal();

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

    const handleSubmit = async (params: CreateBillParams, bill?: Bill) => {
        show();
        try {
            bill
                ? await billService.update(bill.id, params)
                : await billService.create(params)
            addAlert({ type: 'success', message: `Bill ${bill ? 'updated' : 'saved'} successfully!` });
            await fetchItems();
        } catch (error) {
            addAlert({
                type: 'error',
                message: (error as Error)?.message ?? `Error ${bill ? 'updating' : 'saving'} Bill`
            });
            console.error('Bill => handleSubmit => ', error)
        } finally {
            hide();
        }
    }

    const handleOnDelete = async (item?: Bill) => {
        if(!item) {
            return;
        }
        show();
        try {
            await billService.remove(item.id);
            addAlert({ type: 'success', message: 'Bill deleted successfully!' });
            await fetchItems();
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? 'Error deleting Bill' });
        }
    }

    const handleOpenPersistModal = (bill?: Bill) => {
        openModal({
            width: '799px',
            title: `${bill ? 'Edit' : 'Create'} Bill`,
            body: (
                <Persist banks={banks} groups={groups} bill={bill} onClose={closeModal} onSubmit={handleSubmit}/>
            ),
            closeOnEsc: true,
            closeOnOutsideClick: true,
            removeBackgroundScroll: true,
        })
    }

    const handleOpenDeleteModal = (bill?: Bill) => {
        openModal({
            width: '700px',
            title: `Are you sure you want to delete Bill`,
            body: (
                <ModalDelete item={bill} onClose={closeModal} onDelete={(item) => handleOnDelete(item as Bill)} />
            ),
            closeOnEsc: true,
            closeOnOutsideClick: true,
            removeBackgroundScroll: true,
        })
    }

    useEffect(() => {
        setHasAllDependencies(banks.length > 0 && groups.length > 0 && suppliers.length > 0);
    }, [banks, groups, suppliers]);

    return !isLoading  ? (
        <>
            <PageHeader resourceName="Bill" action={{
                label: 'Create New Bill',
                onClick: () => handleOpenPersistModal(),
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
                <>
                    <Tabs fluid items={billListGroup.map((item) => ({
                        title: item.title,
                        children: <SubTab
                            key={item.title}
                            list={item.list}
                            suppliers={suppliers}
                            handleOpenDeleteModal={handleOpenDeleteModal}
                            handleOpenPersistModal={handleOpenPersistModal}

                        />,
                    }))}/>
                    {modal}
                </>
            )}
        </>
    ) : null;
}