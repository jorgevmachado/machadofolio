'use client'
import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Bank, Paginate, QueryParameters } from '@repo/business';

import { Button, Table, Text, ETypeTableHeader, Pagination } from '@repo/ds';
import { useAlert, useLoading } from '@repo/ui';

import { bankService } from '../shared';

import './banks.scss';

type TableProps = React.ComponentProps<typeof Table>;

export default function BanksPage() {
    const isMounted = useRef(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [results, setResults] = useState<Array<Bank>>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sortedColumn, setSortedColumn] = useState<TableProps['sortedColumn']>({
        sort: '',
        order: '',
    });

    const router = useRouter();

    const { addAlert } = useAlert();
    const { show, hide, isLoading } = useLoading();

    const fetchItems = async ({ page = currentPage, limit = 10,  ...props}: QueryParameters) => {
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

    const handleCreate = () => {
        router.push('/banks/create');
    }

    const handleEdit = (id: string) => {
        router.push(`/banks/${id}`);
    }

    const handleDelete = (id: string) => {
        console.log('# => handleDelete => id => ', id);
    }

    const handleOnSortedColumn = (sortedColumn: TableProps['sortedColumn']) => {
        setSortedColumn(sortedColumn);
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    return (
        <div>
            <div className="banks__header">
                <Text tag="h1" variant="big" className="banks__header--title">
                    Management of Banks
                </Text>
                <Button  className="page-header__button" onClick={handleCreate} context="success">
                    Create new Bank
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
                    edit: { onClick: ({ id }: Bank) => handleEdit(id) },
                    delete: { onClick: ({ id }: Bank) => handleDelete(id) },
                }}
                loading={isLoading}
                onRowClick={({ id }: Bank) => handleEdit(id) }
                sortedColumn={sortedColumn}
                onSortedColumn={handleOnSortedColumn}
            />
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
        </div>
    )
}
