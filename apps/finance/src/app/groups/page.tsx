'use client'
import React, { useEffect, useRef, useState } from 'react';

import { Group, Paginate, QueryParameters } from '@repo/business';

import { ETypeTableHeader } from '@repo/ds';

import { useAlert, useLoading } from '@repo/ui';

import { groupService } from '../shared';

import { PageCrud } from '../../components';

export default function GroupsPage() {
    const isMounted = useRef(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [results, setResults] = useState<Array<Group>>([]);
    const [totalPages, setTotalPages] = useState<number>(1);

    const { addAlert } = useAlert();
    const { show, hide, isLoading } = useLoading();

    const fetchItems = async ({ page = currentPage, limit = 10,  ...props}: QueryParameters) => {
        show();
        try {
            const response = (await groupService.getAll({...props, page, limit })) as Paginate<Group>;
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

    useEffect(() => {
        if(isMounted.current) {
            fetchItems({ page: currentPage }).then();
        }
    }, [currentPage, isMounted]);

    useEffect(() => {
        if(!isMounted.current) {
            isMounted.current = true;
            fetchItems({ page: currentPage }).then();
        }
    }, []);

    const handleSave = async (item?: Group) => {
        if(!item) {
            return;
        }
        const isEdit = Boolean(item?.id);
        show();
        try {
            const body = { name: item.name ?? '' };
            isEdit
                ? await groupService.update(item.id, body)
                : await groupService.create(body);
            addAlert({ type: 'success', message: `Bank ${isEdit ? 'updated' : 'saved'} successfully!` });
            await fetchItems({ page: currentPage });
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? `Error ${isEdit ? 'updating' : 'saving'} Bank` });
            console.error(error)
        } finally {
            hide();
        }
    }

    const handleDelete = async (item?: Group) => {
        if(!item) {
            return;
        }
        show();
        try {
            await groupService.remove(item.id);
            addAlert({ type: 'success', message: 'Bank deleted successfully!' });
            await fetchItems({ page: currentPage });
        } catch (error) {
            addAlert({ type: 'error', message: (error as Error)?.message ?? 'Error deleting Bank' });
            console.error(error)
        } finally {
            hide();
        }
    }

    return (
        <PageCrud
            items={results}
            inputs={[
                {
                    fluid: true,
                    type: 'text',
                    name: 'name',
                    label: 'Group',
                    required: true,
                    placeholder: 'Enter a group'
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
                edit: async (item) => handleSave(item as Group),
                create: async (item) => handleSave(item as Group),
                delete: async (item) => handleDelete(item as Group),
            }}
            loading={isLoading}
            onRowClick={(item) => handleSave(item as Group)}
            totalPages={totalPages}
            currentPage={currentPage}
            resourceName="Group"
            handlePageChange={setCurrentPage}
        />
    )
}