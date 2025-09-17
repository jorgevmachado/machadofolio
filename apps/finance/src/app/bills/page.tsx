'use client'
import { useEffect, useRef, useState } from 'react';

import { Bill, type BillList, CreateBillParams } from '@repo/business';

import { Tabs } from '@repo/ds';

import { useAlert, useLoading, useModal } from '@repo/ui';

import { ModalDelete, PageHeader } from '../../components';

import { billBusiness, billService } from '../../shared';

import { useFinance } from '../../hooks';

import { Fallback, Persist, SubTab } from './components';


export default function BillsPage() {
    const isMounted = useRef(false);

    const [hasAllDependencies, setHasAllDependencies] = useState<boolean>(false);
    const [billListGroup, setBillListGroup] = useState<Array<BillList>>([]);

    const { show, hide, isLoading } = useLoading();
    const { addAlert } = useAlert();
    const { openModal, modal, closeModal } = useModal();
    const { fetch, refresh, banks, groups, suppliers } = useFinance();

    const fetchItems = async () => {
        show()
        try {
            const response = await billService.getAll({ withRelations: true }) as Array<Bill>;
            const billListGroup = billBusiness.mapBillListByFilter(response, 'group');
            setBillListGroup(billListGroup);
        } catch (error) {
            console.error('# => BillsPage => fetchItems => error => ', error)
            addAlert({
                type: 'error',
                message: `Error fetching Bills.`,
            });
        } finally {
            hide();
        }
    }

    const handleSubmit = async (params: CreateBillParams, bill?: Bill) => {
        show();
        try {
            bill
                ? await billService.update(bill.id, params)
                : await billService.create(params)
            addAlert({ type: 'success', message: `Bill ${bill ? 'updated' : 'saved'} successfully!` });
            await fetchItems();
            refresh();
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
        if (!item) {
            return;
        }
        show();
        try {
            await billService.remove(item.id);
            addAlert({ type: 'success', message: 'Bill deleted successfully!' });
            await fetchItems();
            refresh();
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? 'Error deleting Bill' });
        }
    }

    const handleOpenPersistModal = (bill?: Bill) => {
        console.log('# => fuck')
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
                <ModalDelete item={bill} onClose={closeModal} onDelete={(item) => handleOnDelete(item as Bill)}/>
            ),
            closeOnEsc: true,
            closeOnOutsideClick: true,
            removeBackgroundScroll: true,
        })
    }

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            fetch().then();
            fetchItems().then();
        }
    }, []);

    useEffect(() => {
        setHasAllDependencies(banks.length > 0 && groups.length > 0 && suppliers.length > 0);
    }, [banks, groups, suppliers]);

    return !isLoading ? (
        <>
            <PageHeader resourceName="Bill" action={{
                label: 'Create New Bill',
                onClick: () => handleOpenPersistModal(),
                disabled: !hasAllDependencies,
            }}/>
            {!hasAllDependencies || billListGroup.length === 0 ? (
                <Fallback hasBills={billListGroup.length > 0} hasAllDependencies={hasAllDependencies}/>
            ) : (
                <>
                    <Tabs fluid items={billListGroup.map((item) => ({
                        title: item.title,
                        children: <SubTab
                            key={item.title}
                            list={item.list}
                            handleOpenDeleteModal={handleOpenDeleteModal}
                        />,
                    }))}/>
                </>
            )}
            {modal}
        </>
    ) : null;
}