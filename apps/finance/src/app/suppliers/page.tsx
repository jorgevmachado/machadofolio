'use client'
import React, { useEffect, useRef, useState } from 'react';

import { Paginate, QueryParameters, Supplier, SupplierType } from '@repo/business';

import { Button, ETypeTableHeader, Pagination, Table, Text } from '@repo/ds';

import { useAlert, useLoading, useModal } from '@repo/ui';

import { bankService, supplierService, supplierTypeService } from '../shared';

import { Persist } from './components';

import './supplier.scss';
import { DependencyFallback } from '../../components';
import { router } from 'next/client';

type TableProps = React.ComponentProps<typeof Table>;

export default function SuppliersPage() {
    const isMounted = useRef(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [results, setResults] = useState<Array<Supplier>>([]);
    const [types, setTypes] = useState<Array<SupplierType>>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sortedColumn, setSortedColumn] = useState<TableProps['sortedColumn']>({
        sort: '',
        order: '',
    });

    const { addAlert } = useAlert();
    const { show, hide, isLoading } = useLoading();
    const { openModal, modal, closeModal } = useModal();

    const fetchTypes = async () => {
        if(types.length === 0) {
            show();
            try {
                const response = await supplierTypeService.getAll({});
                console.log('# => fetchTypes => response => ', response);
                setTypes(response as Array<SupplierType>);
            } catch (error) {
                addAlert({ type: 'error', message: 'Error fetching Supplier Types' });
                console.error(error)
            } finally {
                hide();
            }
        }
    }

    const fetchItems = async ({ page = currentPage, limit = 10,  ...props}: QueryParameters) => {
        show();
        try {
            const response = (await supplierService.getAll({...props, page, limit })) as Paginate<Supplier>;
            setResults(response.results);
            setTotalPages(response.pages);
            return response;
        } catch (error) {
            addAlert({ type: 'error', message: 'Error fetching Supplier' });
            console.error(error)
            throw error;
        } finally {
            hide();
        }
    }

    useEffect(() => {
        if(isMounted.current) {
            fetchItems({ page: currentPage }).then();
        }
    }, [currentPage, isMounted]);

    useEffect(() => {
        if(!isMounted.current) {
            isMounted.current = true;
            fetchItems({ page: currentPage }).then();
            fetchTypes().then();
        }
    }, []);

    useEffect(() => {
        console.log('# => types => ', types);
    }, [types]);

    const handleSave = async (supplier?: Supplier) => {
        if(!supplier) {
            return;
        }
        show();
        try {
            const body = { name: supplier.name ?? '', type: supplier?.type?.name ?? '' }
            supplier?.id
                ? await supplierService.update(supplier.id, body)
                : await supplierService.create(body);
            addAlert({ type: 'success', message: 'Bank saved successfully!' });
            await fetchItems({ page: currentPage });
            closeModal();
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? 'Error saving Bank' });
            console.error(error)
        } finally {
            hide();
        }
    }

    const handleOpenModal = (supplier?: Supplier) => {
        openModal({
            title: supplier?.id ? `Edit Supplier` : `Create Supplier`,
            body: (<Persist supplier={supplier} onClose={closeModal} onSubmit={handleSave}/>)
        })
    }

    const handleDelete = (item: Supplier) => {
        openModal({
            title: `Are you sure you want to delete the Supplier ${item.name}`,
            width: '700px',
            body: (
                <div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                        <Button context="error" appearance="outline" onClick={closeModal}>Cancel</Button>
                        <Button context="error" onClick={async () => {
                            show();
                            try {
                                await bankService.remove(item.id);
                                addAlert({ type: 'success', message: 'Bank deleted successfully!' });
                                await fetchItems({ page: currentPage });
                                closeModal();
                            } catch (error) {
                                addAlert({ type: 'error', message: (error as Error)?.message ?? 'Error deleting Bank' });
                                console.error(error)
                            } finally {
                                hide();
                            }
                        }}>Delete</Button>
                    </div>
                </div>
            )
        })
    }

    const handleOnSortedColumn = (sortedColumn: TableProps['sortedColumn']) => {
        setSortedColumn(sortedColumn);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    return (
        <div>
            {types.length === 0  ? (
                <DependencyFallback
                    message="No supplier types were found. Please create a supplier type before creating a supplier."
                    button={{
                        label: 'Create Supplier Type',
                        onClick: () => router.push('/suppliers/types'),
                    }}
                />
                ) : (
                <>
                    <div className="supplier__header">
                        <Text tag="h1" variant="big" className="supplier__header--title">
                            Management of Supplier
                        </Text>
                        <Button  className="supplier__header--button" onClick={() => handleOpenModal()} context="success">
                            Create new Supplier
                        </Button>
                    </div>
                    <Table
                        items={results}
                        headers={[
                            {
                                text: 'Name',
                                value: 'name',
                                sortable: true
                            },
                            {
                                text: 'Created At',
                                value: 'created_at',
                                type: ETypeTableHeader.DATE,
                                sortable: true,
                            },
                        ]}
                        actions={{
                            text: 'Actions',
                            align: 'center',
                            edit: { onClick: (item: Supplier) => handleOpenModal(item) },
                            delete: { onClick: (item: Supplier) => handleDelete(item) },
                        }}
                        loading={isLoading}
                        onRowClick={(item: Supplier) => handleOpenModal(item)}
                        sortedColumn={sortedColumn}
                        onSortedColumn={handleOnSortedColumn}
                    />
                    {modal}
                    {totalPages > 1 && (
                        <Pagination
                            fluid
                            type="numbers"
                            total={totalPages}
                            range={totalPages}
                            current={currentPage}
                            disabled
                            handleNew={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    )
}