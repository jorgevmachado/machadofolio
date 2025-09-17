'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Paginate, QueryParameters, Supplier } from '@repo/business';

import { ETypeTableHeader } from '@repo/ds';

import { useAlert, useLoading } from '@repo/ui';

import { DependencyFallback, PageCrud } from '../../components';

import { supplierService } from '../../shared';
import { useFinance } from '../../hooks';


export default function SuppliersPage() {
    const router = useRouter();
    const isMounted = useRef(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [results, setResults] = useState<Array<Supplier>>([]);
    const [totalPages, setTotalPages] = useState<number>(1);

    const { addAlert } = useAlert();
    const { show, hide, isLoading } = useLoading();
    const { fetch, refresh, supplierTypes } = useFinance();

    const fetchSuppliers = async ({ page = currentPage, limit = 10, ...props }: QueryParameters) => {
        show();
        try {
            const response = (await supplierService.getAll({ ...props, page, limit })) as Paginate<Supplier>;
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

    const handleSave = async (supplier?: Supplier) => {
        if (!supplier) {
            return;
        }
        const isEdit = Boolean(supplier?.id);
        show();
        try {
            const body = { name: supplier.name ?? '', type: supplier?.type?.name ?? '' }
            isEdit
                ? await supplierService.update(supplier.id, body)
                : await supplierService.create(body);
            addAlert({ type: 'success', message: `Supplier ${isEdit ? 'updated' : 'saved'} successfully!` });
            await fetchSuppliers({ page: currentPage });
            refresh();
        } catch (error) {
            addAlert({
                type: 'error',
                message: (error as Error)?.message ?? `Error ${isEdit ? 'updating' : 'saving'} Supplier`
            });
            console.error(error)
        } finally {
            hide();
        }
    }

    const handleDelete = async (supplier: Supplier) => {
        show();
        try {
            await supplierService.remove(supplier.id);
            addAlert({ type: 'success', message: 'Supplier deleted successfully!' });
            await fetchSuppliers({ page: currentPage });
            refresh();
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? 'Error deleting Supplier' });
            console.error(error)
        } finally {
            hide();
        }
    }

    useEffect(() => {
        if (isMounted.current) {
            fetchSuppliers({ page: currentPage }).then();
        }
    }, [currentPage, isMounted]);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            fetchSuppliers({ page: currentPage }).then();
            fetch().then();
        }
    }, []);

    return (
        <div>
            {supplierTypes.length === 0 ? (
                <DependencyFallback
                    message="No supplier types were found. Please create a supplier type before creating a supplier."
                    button={{
                        label: 'Create Supplier Type',
                        onClick: () => router.push('/suppliers/types'),
                    }}
                />
            ) : (
                <PageCrud
                    items={results}
                    inputs={[
                        {
                            fluid: true,
                            type: 'select',
                            name: 'type',
                            label: 'Type',
                            list: supplierTypes,
                            options: supplierTypes.map((type) => ({ value: type.id, label: type.name })),
                            required: true,
                            placeholder: 'Enter a supplier type'
                        },
                        {
                            fluid: true,
                            type: 'text',
                            name: 'name',
                            label: 'Supplier',
                            required: true,
                            placeholder: 'Enter a supplier'
                        },
                    ]}
                    headers={[
                        {
                            text: 'Name',
                            value: 'name',
                            sortable: true
                        },
                        {
                            text: 'Type',
                            value: 'type.name',
                            sortable: true,
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
                        edit: async (item) => handleSave(item as Supplier),
                        create: async (item) => handleSave(item as Supplier),
                        delete: async (item) => handleDelete(item as Supplier),
                    }}
                    loading={isLoading}
                    onRowClick={(item) => handleSave(item as Supplier)}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    resourceName="Supplier"
                    handlePageChange={setCurrentPage}

                />
            )}
        </div>
    )
}