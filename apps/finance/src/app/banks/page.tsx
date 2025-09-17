'use client'
import React, { useEffect, useRef, useState } from 'react';

import { Bank, Paginate, QueryParameters } from '@repo/business';

import { ETypeTableHeader } from '@repo/ds';
import { useAlert, useLoading } from '@repo/ui';

import { PageCrud } from '../../components';

import { bankService } from '../../shared';
import { useFinance } from '../../hooks';

export default function BanksPage() {
    const isMounted = useRef(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [results, setResults] = useState<Array<Bank>>([]);
    const [totalPages, setTotalPages] = useState<number>(1);

    const { addAlert } = useAlert();
    const { show, hide, isLoading } = useLoading();
    const { refresh } = useFinance();

    const fetchBanks = async ({ page = currentPage, limit = 10,  ...props}: QueryParameters) => {
        show();
        try {
            const response = (await bankService.getAll({...props, page, limit })) as Paginate<Bank>;
            setResults(response.results);
            setTotalPages(response.pages);
            return response;
        } catch (error) {
            addAlert({ type: 'error', message: 'Error fetching Banks' });
            console.error(error)
            throw error;
        } finally {
            hide();
        }
    }

    const handleSave = async (bank?: Bank) => {
        if(!bank) {
            return;
        }
        const isEdit = Boolean(bank?.id);
        show();
        try {
            const body = { name: bank.name ?? '' };
            isEdit
                ? await bankService.update(bank.id, body)
                : await bankService.create(body);
            addAlert({ type: 'success', message: `Bank ${isEdit ? 'updated' : 'saved'} successfully!` });
            await fetchBanks({ page: currentPage });
            refresh();
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? `Error ${isEdit ? 'updating' : 'saving'} Bank` });
            console.error(error)
        } finally {
            hide();
        }
    }

    const handleDelete = async (item?: Bank) => {
        if(!item) {
            return;
        }
        show();
        try {
            await bankService.remove(item.id);
            addAlert({ type: 'success', message: 'Bank deleted successfully!' });
            await fetchBanks({ page: currentPage });
            refresh();
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? 'Error deleting Bank' });
            console.error(error)
        } finally {
            hide();
        }
    }

    useEffect(() => {
        if(isMounted.current) {
            fetchBanks({ page: currentPage }).then();
        }
    }, [currentPage, isMounted]);

    useEffect(() => {
        if(!isMounted.current) {
            isMounted.current = true;
            fetchBanks({ page: currentPage }).then();
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
                    label: 'Bank',
                    required: true,
                    placeholder: 'Enter a bank'
                }
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
                edit: async (item) => handleSave(item as Bank),
                create: async (item) => handleSave(item as Bank),
                delete: async (item) => handleDelete(item as Bank),
            }}
            loading={isLoading}
            onRowClick={(item) => handleSave(item as Bank)}
            totalPages={totalPages}
            currentPage={currentPage}
            resourceName="Bank"
            handlePageChange={setCurrentPage}
        />
    )
}
