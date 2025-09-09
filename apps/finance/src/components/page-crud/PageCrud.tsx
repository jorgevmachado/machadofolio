'use client'
import React, { useState } from 'react';
import { Button, Pagination, Table, Text } from '@repo/ds';

import { useModal } from '@repo/ui';

import ModalDelete from './modal-delete';
import ModalPersist from './modal-persist';

import './PageCrud.scss';

type TableProps = React.ComponentProps<typeof Table>;

type ModalPersistProps = React.ComponentProps<typeof ModalPersist>;

type Actions = {
    text: string;
    align: 'center' | 'left' | 'right';
    edit?: (item: unknown) => Promise<void>;
    create?: (item: unknown) => Promise<void>;
    delete?: (item: unknown) => Promise<void>;
}

type PageCrudProps = Pick<TableProps, 'items' | 'headers' | 'loading' |  'onRowClick'> & {
    inputs?: ModalPersistProps['inputs'];
    actions?: Actions;
    totalPages?: number;
    currentPage?: number;
    resourceName: string;
    handlePageChange?: (page: number) => void;
};

export default function PageCrud({
    items,
    inputs,
    actions,
    headers,
    loading,
    totalPages = 0,
    onRowClick,
    currentPage,
    resourceName,
    handlePageChange
}: PageCrudProps) {
    const { openModal, modal, closeModal } = useModal();
    const [sortedColumn, setSortedColumn] = useState<TableProps['sortedColumn']>({
        sort: '',
        order: '',
    });

    const hasId = (obj: unknown): obj is { id: string | number } =>
        !!obj && typeof obj === 'object' && 'id' in obj;

    const handlePersistModal = (item?: unknown) => {
        if(item && !actions?.edit) {
            return;
        }
        if(!item && !actions?.create) {
            return;
        }
        if(!inputs) {
            return;
        }
        openModal({
            title: `${hasId(item) ? 'Edit' : 'Create'} ${resourceName}`,
            body: (
                <ModalPersist
                    item={item}
                    inputs={inputs}
                    onClose={closeModal}
                    onSubmit={actions?.create}
                />
            )

        })
    }

    const handleDeleteModal = (item: unknown) => {
        if(!actions?.delete) {
            return;
        }
        openModal({
            title: `Are you sure you want to delete the ${resourceName}`,
            width: '700px',
            body: (
                <ModalDelete item={item} onClose={closeModal} onDelete={actions?.delete}/>
            )
        })
    }

    return (
        <div className="page-crud">
            <div className="page-crud__header">
                <Text tag="h1" variant="big" className="banks__header--title">
                    Management of {resourceName}
                </Text>
                {actions?.create && inputs?.length && (
                    <Button onClick={() => handlePersistModal()} context="success">
                        Create new {resourceName}
                    </Button>
                )}

            </div>
            <Table
                items={items}
                actions={actions && {
                    text: actions.text,
                    align: actions.align,
                    edit: actions?.edit  && inputs?.length? { onClick: (item: unknown) => handlePersistModal(item)}  : undefined,
                    delete: actions?.delete ? { onClick: (item: unknown) => handleDeleteModal(item)}  : undefined
                }}
                headers={headers}
                loading={loading}
                onRowClick={onRowClick ? (item) => handlePersistModal(item) : undefined}
                sortedColumn={sortedColumn}
                onSortedColumn={setSortedColumn}
            />
            {modal}
            {currentPage && totalPages > 1 && (
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