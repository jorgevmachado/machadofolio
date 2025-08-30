'use client'
import React, { useEffect, useRef, useState } from 'react';

import { Bank, Paginate, QueryParameters } from '@repo/business';

import { Button, Table, Text, ETypeTableHeader, Pagination } from '@repo/ds';
import { useAlert, useLoading, useModal } from '@repo/ui';

import { bankService } from '../shared';

import './banks.scss';
import { Persist } from './components';

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

    const { addAlert } = useAlert();
    const { show, hide, isLoading } = useLoading();
    const { openModal, modal, closeModal } = useModal();

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

    const handleSave = async (bank?: Bank) => {
        if(!bank) {
            return;
        }
        show();
        try {
            const body = { name: bank.name ?? '' };
            bank?.id
                ? await bankService.update(bank.id, body)
                : await bankService.create(body);
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

    const handleOpenModal = (item?: Bank) => {
        openModal({
            title: item?.id ? `Edit Bank` : `Create Bank`,
            body: (<Persist bank={item} onClose={closeModal} onSubmit={handleSave}/>)
        })
    }

    const handleDelete = (item: Bank) => {
        openModal({
            title: `Are you sure you want to delete the bank ${item.name}`,
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
            <div className="banks__header">
                <Text tag="h1" variant="big" className="banks__header--title">
                    Management of Banks
                </Text>
                <Button  className="page-header__button" onClick={() => handleOpenModal()} context="success">
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
                    edit: { onClick: (item: Bank) => handleOpenModal(item) },
                    delete: { onClick: (item: Bank) => handleDelete(item) },
                }}
                loading={isLoading}
                onRowClick={(item: Bank) => handleOpenModal(item)}
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
        </div>
    )
}
