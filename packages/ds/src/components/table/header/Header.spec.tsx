import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ETypeTableHeader } from '../enum';
import Header from './Header';

jest.mock('../../../utils', () => {
    const originalModule = jest.requireActual('../../../utils');
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

jest.mock('../../../elements', () => ({
    Icon: ({ children, 'data-testid': dataTestId = 'mock-icon', ...props }: any) => (<div {...props} data-testid={dataTestId}>{children}</div>),
}));

describe('<Header/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    const mockHandleSort = jest.fn();
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
        handleSort: mockHandleSort,
        sortedColumn: {
            order: '',
            sort: '',
        }
    }

    const renderComponent = (props: any = {}) => {
        return render(<Header {...defaultProps} {...props}/>);
    }

    it('should render with default props', () => {
        renderComponent();
        expect(screen.getByTestId('ds-table-header')).toBeInTheDocument();
        defaultProps.headers.forEach((item, index) => {
            expect(screen.getByTestId(`ds-table-header-${index}`));
            if(item.sortable) {
                expect(screen.getByTestId(`ds-table-header-icon-${index}`));
            }
        });
    });

    it('should on click in header', () => {
        renderComponent();
        expect(screen.getByTestId('ds-table-header')).toBeInTheDocument();
        const row = screen.getByTestId('ds-table-header-0');
        expect(row).toBeInTheDocument();
        fireEvent.click(row);
        expect(mockHandleSort).toHaveBeenCalled();
    });

    it('should on click in icon', () => {
        renderComponent();
        expect(screen.getByTestId('ds-table-header')).toBeInTheDocument();
        expect(screen.getByTestId('ds-table-header-0')).toBeInTheDocument();
        const icon = screen.getByTestId('ds-table-header-icon-0')
        fireEvent.click(icon);
        expect(mockHandleSort).toHaveBeenCalled();
    });

    it('should render with sorted name asc.', () => {
        renderComponent({
            sortedColumn: {
                order: 'asc',
                sort: 'name',
            }});
        expect(screen.getByTestId('ds-table-header')).toBeInTheDocument();
        const icon = screen.getByTestId('ds-table-header-icon-0');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('ds-table-header__cell--content-icon ds-table-header__cell--content-icon__active');
    });

    it('should render with sorted name desc.', () => {
        renderComponent({
            sortedColumn: {
                order: 'desc',
                sort: 'name',
            }});
        expect(screen.getByTestId('ds-table-header')).toBeInTheDocument();
        const icon = screen.getByTestId('ds-table-header-icon-0');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('ds-table-header__cell--content-icon ds-table-header__cell--content-icon__active');
    });
});