import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/internal/test';

import React from 'react';

import Button from '../button';

import { ETypeTableHeaderItem } from './enum';

import type { SortedColumn } from './types';

import Table from './Table';

type TableProps = React.ComponentProps<typeof Table>;

const meta = {
    tags: ['autodocs'],
    args: {
        items: [
            {
                name: 'John Doe',
                type: {
                    name: 'Type 1',
                },
                total: 10,
                active: true,
                created_at: '2023-01-01',
            },
            {
                name: 'Jane Doe',
                type: {
                    name: 'Type 2',
                },
                total: 20,
                active: false,
                created_at: '2023-01-02',
            },
            {
                name: 'Bob Smith',
                type: {
                    name: 'Type 3',
                },
                total: 30,
                active: true,
                created_at: '2023-01-03',
            },
            {
                name: 'Alice Johnson',
                type: {
                    name: 'Type 4',
                },
                total: 40,
                active: false,
                created_at: '2023-01-06',
            },
            {
                name: 'Eve Smith',
                type: {
                    name: 'Type 5',
                },
                total: 50,
                active: true,
                created_at: '2023-01-04',
            },
            {
                name: 'Charlie Johnson',
                type: {
                    name: 'Type 6',
                },
                total: 60,
                active: false,
                created_at: '2023-01-05',
            },
            {
                name: 'David Johnson',
                type: {
                    name: 'Type 7',
                },
                total: 70,
                active: true,
                created_at: '2023-01-06',
            },
            {
                name: 'Emily Johnson',
                type: {
                    name: 'Type 8',
                },
                total: 80,
                active: false,
                created_at: '2023-01-06',
            },
            {
                name: 'Frank Johnson',
                type: {
                    name: 'Type 9',
                },
                total: 90,
                active: true,
                created_at: '2023-01-07',
            },
            {
                name: 'Grace Johnson',
                type: {
                    name: 'Type 10',
                },
                total: 100,
                active: false,
                created_at: '2023-01-08',
            }
        ],
        headers: [
            {
                text: 'Name',
                value: 'name',
                sortable: true,
            },
            {
                text: 'Type',
                value: 'type.name',
                sortable: true,
            },
            {
                text: 'Total',
                value: 'total',
                type: ETypeTableHeaderItem.MONEY,
                sortable: true,
            },
            {
                text: 'Created At',
                value: 'created_at',
                type: ETypeTableHeaderItem.DATE,
                sortable: true,
            },
        ],
        actions: {
            text: 'Actions',
            align: 'center',
            edit: { onClick: fn() },
            delete: { onClick: fn() },
        },
        loading: false,
        onRowClick: fn(),
        onSortedColumn: fn(),
        notFoundMessage: 'No data found',
        currentSortedColumn: { sort: '', order: '' }
    },
    title: 'Components/Table',
    argTypes: {},
    component: Table,
    parameters: {},
    decorators: [
        (Story) => (
            <div style={{ height: '100vh' }}>
                <Story/>
            </div>
        ),
    ],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const CustomTable: React.FC<TableProps> = (props) => {
    const [actionEdit, setActionEdit] = useState<Array<string>>([]);
    const [actionDelete, setActionDelete] = useState<Array<string>>([]);
    const [onRowClick, setOnRowClick] = useState<Array<string>>([]);
    const [sortedColumn, setSortedColumn] = useState<SortedColumn>({
        sort: '',
        order: '',
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = (type: 'row' | 'edit' | 'delete', item: { name: string }) => {
        setLoading(true);
        switch (type) {
            case 'row':
                const currentOnRowClick = [...onRowClick];
                currentOnRowClick.push(`Row ${item['name']} ${new Date().toLocaleTimeString()}`);
                setOnRowClick(currentOnRowClick);
                break;
            case 'edit':
                const currentActionEdit = [...actionEdit];
                currentActionEdit.push(`Edit ${item['name']} ${new Date().toLocaleTimeString()}`);
                setActionEdit(currentActionEdit);
                break;
            case 'delete':
                const currentActionDelete = [...actionDelete];
                currentActionDelete.push(`Delete ${item['name']} ${new Date().toLocaleTimeString()}`);
                setActionDelete(currentActionDelete);
                break;
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    const handleTable = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                <h3>TABLE</h3>
                <Button context="success" onClick={() => handleTable()}>REFRESH</Button>
            </div>
            {!loading && (
                <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                    <div>
                        {onRowClick.map((item) => (
                            <p>{item}</p>
                        ))}
                    </div>
                    <div>
                        {actionEdit.map((item) => (
                            <p>{item}</p>
                        ))}
                    </div>
                    <div>
                        {actionDelete.map((item) => (
                            <p>{item}</p>
                        ))}
                    </div>
                </div>
            )}
            <Table
                {...props}
                actions={{
                    ...props.actions,
                    edit: {
                        ...props.actions?.edit,
                        onClick: (item: { name: string }) => {
                            handleClick('edit', item);
                            props.actions?.edit?.onClick?.(item);
                        }
                    },
                    delete: {
                        ...props.actions?.delete,
                        onClick: (item: { name: string }) => {
                            handleClick('delete', item);
                            props.actions?.delete?.onClick?.(item);
                        }
                    },
                }}
                loading={loading}
                onRowClick={(item: { name: string }) => handleClick('row', item)}
                onSortedColumn={({ sort, order }) => setSortedColumn({ sort, order })}
                currentSortedColumn={sortedColumn}
            />

        </div>
    )
}

export const Default: Story = {
    render: (args) => (
        <CustomTable {...args}/>
    )
};

export const EmptyTable: Story = {
    render: (args) => (
        <CustomTable {...args} items={[]}/>
    )
};

export const TableWithActionsIcon: Story = {
    render: (args) => (
        <CustomTable {...args} actions={{
            ...args.actions,
            edit: {
                icon: { icon: 'edit' },
                onClick: fn(),
                context: 'attention'
            },
            delete: {
                icon: { icon: 'trash' },
                onClick: fn(),
                context: 'error'
            }
        }}/>
    )
};

export const WithColorCondition: Story = {
    render: (args) => (
        <CustomTable {...args} headers={args.headers.map((item) => ({
            ...item,
            conditionColor: {
                value: 'active',
                trueColor: 'success-80',
                falseColor: 'error-80',
            },
        }))}/>
    )
};