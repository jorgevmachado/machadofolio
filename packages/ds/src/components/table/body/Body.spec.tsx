import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

jest.mock('@repo/services', () => {
    const originalModule = jest.requireActual('@repo/services');
    return {
        ...originalModule,
        currencyFormatter: (value: number) => value.toString()
    }
})

jest.mock('./actions', () => ({
    __esModule: true,
    default: ({ ...props }: any) => (
        <div data-testid="ds-table-body-actions">
            <button {...props?.actions?.edit} data-testid="ds-table-body-action-edit"/>
            <button {...props?.actions?.delete} data-testid="ds-table-body-action-delete"/>
        </div>
    ),
    Button: ({ ...props }: any) => (
        <div data-testid="ds-table-body-actions">
            <button {...props?.actions?.edit} data-testid="ds-table-body-action-edit"/>
            <button {...props?.actions?.delete} data-testid="ds-table-body-action-delete"/>
        </div>
    ),
}));

import Body from './Body';
import { ETypeTableHeader } from '../enum';

describe('<Body/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    const mockGetClassNameRow = jest.fn();
    const mockOnRowClick = jest.fn();

    const defaultProps = {
        headers: [
            {
                text: 'Name',
                value: 'name',
                sortable: true,
                conditionColor: {
                    value: 'active',
                    trueColor: 'success-80',
                    falseColor: 'error-80',
                },
            },
            {
                text: 'Type',
                value: 'type.name',
                sortable: true,
            },
            {
                text: 'Total',
                value: 'total',
                type: ETypeTableHeader.MONEY,
                sortable: true,
            },
            {
                text: 'Tag',
                value: 'tag'
            },
            {
                text: 'Date',
                value: 'date',
            },
            {
                text: 'Created At',
                value: 'created_at',
                type: ETypeTableHeader.DATE,
                sortable: true,
            },
        ],
        actions: {
            edit: {
                icon: {icon: 'edit' },
                context: 'info',
                onClick: jest.fn()
            },
            delete: {
                icon: {icon: 'edit' },
                context: 'error',
                onClick: jest.fn()
            }
        },
        onRowClick: mockOnRowClick,
        sortedItems: [
            {
                tag: (<p>tag</p>),
                date: new Date('2023-01-01'),
                name: 'John Doe',
                type: {
                    name: 'Type 1',
                },
                total: 10.0,
                active: true,
                created_at: '2023-01-01',
            },
            {
                tag: (<p>tag</p>),
                date: new Date('2023-01-01'),
                name: 'Jane Doe',
                type: {
                    name: 'Type 2',
                },
                total: 20.0,
                active: false,
                created_at: '2023-01-02',
            },
            {
                tag: (<p>tag</p>),
                date: new Date('2023-01-01'),
                name: 'Bob Smith',
                type: {
                    name: 'Type 3',
                },
                total: '30.0',
                active: true,
                created_at: '2023-01-03',
            },
            {
                tag: (<p>tag</p>),
                date: new Date('2023-01-01'),
                name: 'Alice Johnson',
                type: {
                    name: 'Type 4',
                },
                total: 40,
                active: false,
                created_at: '2023-01-06',
            },
            {
                tag: (<p>tag</p>),
                date: new Date('2023-01-01'),
                name: 'Eve Smith',
                type: {
                    name: 'Type 5',
                },
                total: 50,
                active: true,
                created_at: '2023-01-04',
            },
            {
                tag: (<p>tag</p>),
                date: new Date('2023-01-01'),
                name: 'Charlie Johnson',
                type: {
                    name: 'Type 6',
                },
                total: 60,
                active: false,
                created_at: '2023-01-05',
            },
            {
                tag: (<p>tag</p>),
                date: new Date('2023-01-01'),
                name: 'David Johnson',
                type: {
                    name: 'Type 7',
                },
                total: 70,
                active: true,
                created_at: '2023-01-06',
            },
            {
                tag: (<p>tag</p>),
                date: new Date('2023-01-01'),
                name: 'Emily Johnson',
                type: {
                    name: 'Type 8',
                },
                total: 80,
                active: false,
                created_at: '2023-01-06',
            },
            {
                tag: (<p>tag</p>),
                date: new Date('2023-01-01'),
                name: 'Frank Johnson',
                type: {
                    name: 'Type 9',
                },
                total: 90,
                active: true,
                created_at: '2023-01-07',
            },
            {
                tag: (<p>tag</p>),
                date: new Date('2023-01-01'),
                name: 'Grace Johnson',
                type: {
                    name: 'Type 10',
                },
                total: 100,
                active: false,
                created_at: '2023-01-08',
            }
        ],
        formattedDate: true,
        getClassNameRow: mockGetClassNameRow
    }

    const renderComponent = (props: any = {}) => {
        return render(<Body {...defaultProps} {...props}/>);
    }

    it('should render with default props.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-table-body')).toBeInTheDocument();
    });

    it('should on click in row table.', () => {
        renderComponent();
        const row = screen.getByTestId('ds-table-body-row-0');
        expect(row).toBeInTheDocument();
        fireEvent.click(row);
        expect(mockOnRowClick).toHaveBeenCalled();
    });
})