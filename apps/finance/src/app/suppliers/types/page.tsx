'use client'
import React, { useEffect, useRef, useState } from 'react';

import { useI18n } from '@repo/i18n';

import { Paginate, QueryParameters, Supplier, SupplierType } from '@repo/business';

import { ETypeTableHeader } from '@repo/ds';

import { useAlert, useLoading } from '@repo/ui';

import { PageCrud } from '../../../components';

import { supplierTypeService } from '../../../shared';
import { useFinance } from '../../../hooks';

export default function SuppliersTypePage() {
    const { t } = useI18n();
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
            addAlert({ type: 'error', message: t('error_fetching_supplier_types') });
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
            addAlert({ type: 'success', message: `${t('supplier_type')} ${isEdit ? t('updated') : t('saved')} ${t('successfully')}!` });
            await fetchSuppliersType({ page: currentPage });
            refresh();
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? `${t('error_when')} ${isEdit ? t('updating') : t('saving')} ${t('supplier_type')}` });
            console.error(error)
        } finally {
            hide();
        }
    }

    const handleDelete = async (supplierType: SupplierType) => {
        show();
        try {
            await supplierTypeService.remove(supplierType.id);
            addAlert({ type: 'success', message: `${t('supplier_type')} ${t('deleted')} ${t('successfully')}!` });
            await fetchSuppliersType({ page: currentPage });
            refresh();
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? t('error_deleting_supplier_type') });
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
                 label: t('supplier_type'),
                 required: true,
                 placeholder: 'Enter a supplier type'
             },
         ]}
         headers={[
             {
                 text: t('name'),
                 value: 'name',
                 sortable: true
             },
             {
                 text: t('created_at'),
                 value: 'created_at',
                 type: ETypeTableHeader.DATE,
                 sortable: true,
             },
         ]}
         actions={{
             text: t('actions'),
             align: 'center',
             edit: async (item) => handleSave(item as SupplierType),
             create: async (item) => handleSave(item as SupplierType),
             delete: async (item) => handleDelete(item as SupplierType),
         }}
         loading={isLoading}
         onRowClick={(item) => handleSave(item as SupplierType)}
         totalPages={totalPages}
         currentPage={currentPage}
         resourceName={t('supplier_type')}
         handlePageChange={setCurrentPage}

     />
 )
}