'use client'
import React, { useEffect, useRef, useState } from 'react';

import { Paginate, QueryParameters, Supplier, SupplierType } from '@repo/business';

import { ETypeTableHeader } from '@repo/ds';

import { useAlert, useLoading } from '@repo/ui';

import { PageCrud } from '../../../components';

import { supplierTypeService } from '../../../shared';
import { useFinance } from '../../../hooks';

export default function SuppliersTypePage() {
    const isMounted = useRef(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [results, setResults] = useState<Array<SupplierType>>([]);
    const [totalPages, setTotalPages] = useState<number>(1);

    const { addAlert } = useAlert();
    const { show, hide, isLoading } = useLoading();
    const { refresh } = useFinance();

    const fetchSuppliersType = async ({ page = currentPage, limit = 10, ...props }: QueryParameters) => {
        show();
        try {
            const response = (await supplierTypeService.getAll({ ...props, page, limit })) as Paginate<Supplier>;
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

    const handleSave = async (supplierType?: SupplierType) => {
        if (!supplierType) {
            return;
        }
        const isEdit = Boolean(supplierType?.id);
        show();
        try {
            const body = { name: supplierType.name ?? ''}
            isEdit
                ? await supplierTypeService.update(supplierType.id, body)
                : await supplierTypeService.create(body);
            addAlert({ type: 'success', message: `Supplier Type ${isEdit ? 'updated' : 'saved'} successfully!` });
            await fetchSuppliersType({ page: currentPage });
            refresh();
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? `Error ${isEdit ? 'updating' : 'saving'} Supplier Type` });
            console.error(error)
        } finally {
            hide();
        }
    }

    const handleDelete = async (supplierType: SupplierType) => {
        show();
        try {
            await supplierTypeService.remove(supplierType.id);
            addAlert({ type: 'success', message: 'Supplier Type deleted successfully!' });
            await fetchSuppliersType({ page: currentPage });
            refresh();
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? 'Error deleting Supplier Type' });
            console.error(error)
        } finally {
            hide();
        }
    }

    useEffect(() => {
        if (isMounted.current) {
            fetchSuppliersType({ page: currentPage }).then();
        }
    }, [currentPage, isMounted]);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            fetchSuppliersType({ page: currentPage }).then();
        }
    }, []);

 return (
     <PageCrud
         items={results}
         inputs={[
             {
                 fluid: true,
                 type: 'text',
                 name: 'name',
                 label: 'Supplier Type',
                 required: true,
                 placeholder: 'Enter a supplier type'
             },
         ]}
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
             edit: async (item) => handleSave(item as SupplierType),
             create: async (item) => handleSave(item as SupplierType),
             delete: async (item) => handleDelete(item as SupplierType),
         }}
         loading={isLoading}
         onRowClick={(item) => handleSave(item as SupplierType)}
         totalPages={totalPages}
         currentPage={currentPage}
         resourceName="Supplier Type"
         handlePageChange={setCurrentPage}

     />
 )
}