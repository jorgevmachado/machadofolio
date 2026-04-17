import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../elements', () => ({
    Text: ({ children, 'data-testid': dataTestId = 'mock-text', ...props }: any) => (<div {...props} data-testid={dataTestId}>{children}</div>),
    Spinner: ({ children, 'data-testid': dataTestId = 'mock-spinner', ...props }: any) => (<div {...props} data-testid={dataTestId}/>),
}));

jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils');
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

const mockUseBreakpoint: jest.Mock = jest.fn();
jest.mock('../../hooks', () => ({
    __esModule: true,
    useBreakpoint: mockUseBreakpoint,
}));
const mockHandleSort = jest.fn();
jest.mock('./header', () => ({
    __esModule: true,
    default: ({ handleSort, ...props }: any) => (<div data-testid="ds-table-header" onClick={() => handleSort(mockHandleSort())} {...props}/>),
}));

jest.mock('./body', () => ({
    __esModule: true,
    default: ({ ...props }: any) => (<div data-testid="ds-table-body" {...props}/>),
}));

import Table from './Table';
import { useBreakpoint } from '../../hooks';
import { ETypeTableHeader } from './enum';

describe('<Table/>', () => {

    const mockOnRowClick = jest.fn();
    const mockOnChangeOrder = jest.fn();
    const mockOnSortedColumn = jest.fn();
    const mockGetClassNameRow = jest.fn();

    const defaultProps = {
        items: [],
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
        loading: false,
        onRowClick: mockOnRowClick,
        onSortedColumn: mockOnSortedColumn,
        getClassNameRow: mockGetClassNameRow,
    };

    const renderComponent = (props: any = {}) => {
        return render(<Table {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Table Empty', () => {
        it('should render component with props default.', () => {
            mockUseBreakpoint.mockImplementation(() => ({
                isMobile: false,
            }))
            renderComponent();
            const component = screen.getByTestId('ds-table');
            expect(component).toBeInTheDocument();
            expect(component).toHaveClass('ds-table');
            expect(screen.getByTestId('ds-table-no-data')).toBeInTheDocument();
            const text = screen.getByTestId('mock-text');
            expect(text).toBeInTheDocument();
            expect(text).toHaveTextContent('No data found!');
        });

        it('should render component custom not found message.', () => {
            mockUseBreakpoint.mockImplementation(() => ({
                isMobile: false,
                isTablet: false,
                isDesktop: true,
                isLargeDesktop: false,
            }))
            renderComponent({ notFoundMessage: 'Table empty!!!'});
            const component = screen.getByTestId('ds-table');
            expect(component).toBeInTheDocument();
            expect(component).toHaveClass('ds-table');
            expect(screen.getByTestId('ds-table-no-data')).toBeInTheDocument();
            const text = screen.getByTestId('mock-text');
            expect(text).toBeInTheDocument();
            expect(text).toHaveTextContent('Table empty!!!');
        });
    });

    describe('Table Loading', () => {
        mockUseBreakpoint.mockImplementation(() => ({
            isMobile: true,
        }))
        renderComponent({ loading: true });
        expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
    });

    describe('Table Full', () => {
        const mockItems = [
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
        ];
        it('Should render table with items', () => {
            mockUseBreakpoint.mockImplementation(() => ({
                isMobile: false,
            }))
            renderComponent({
                items: mockItems
            });
            expect(screen.getByTestId('ds-table-data')).toBeInTheDocument();
            expect(screen.getByTestId('ds-table-header')).toBeInTheDocument();
            expect(screen.getByTestId('ds-table-body')).toBeInTheDocument();
        });

        it('should click in header and call handleSort', () => {
            mockUseBreakpoint.mockImplementation(() => ({
                isMobile: false,
            }));
            mockHandleSort.mockImplementation(() => defaultProps.headers[0]);
            renderComponent({
                items: mockItems,
                sortedColumn: {
                    order: 'desc',
                    sort: 'name',
                },
            });
            expect(screen.getByTestId('ds-table-data')).toBeInTheDocument();
            const headerComponent = screen.getByTestId('ds-table-header');
            expect(headerComponent).toBeInTheDocument();
            fireEvent.click(headerComponent);
        });

        it('should click in header and call onChangeOrder', () => {
            mockUseBreakpoint.mockImplementation(() => ({
                isMobile: false,
            }));
            mockHandleSort.mockImplementation(() => defaultProps.headers[0]);
            renderComponent({
                items: mockItems,
                sortedColumn: {
                    order: 'desc',
                    sort: 'name',
                },
                onChangeOrder: mockOnChangeOrder,
            });
            expect(screen.getByTestId('ds-table-data')).toBeInTheDocument();
            const headerComponent = screen.getByTestId('ds-table-header');
            expect(headerComponent).toBeInTheDocument();
            fireEvent.click(headerComponent);
            expect(mockOnChangeOrder).toHaveBeenCalled();
        });

        it('should click in header and call handleSort with order asc', () => {
            mockUseBreakpoint.mockImplementation(() => ({
                isMobile: false,
            }));
            mockHandleSort.mockImplementation(() => defaultProps.headers[0]);
            renderComponent({
                items: mockItems,
                sortedColumn: {
                    order: 'asc',
                    sort: 'name',
                },
            });
            expect(screen.getByTestId('ds-table-data')).toBeInTheDocument();
            const headerComponent = screen.getByTestId('ds-table-header');
            expect(headerComponent).toBeInTheDocument();
            fireEvent.click(headerComponent);
        });

        it('should click in header and call handleSort with sortedColumn default', () => {
            mockUseBreakpoint.mockImplementation(() => ({
                isMobile: false,
            }));
            mockHandleSort.mockImplementation(() => defaultProps.headers[0]);
            renderComponent({
                items: mockItems,
            });
            expect(screen.getByTestId('ds-table-data')).toBeInTheDocument();
            const headerComponent = screen.getByTestId('ds-table-header');
            expect(headerComponent).toBeInTheDocument();
            fireEvent.click(headerComponent);
        });

        it('should click in header and call handleSort with sorted object with first undefined', () => {
            mockUseBreakpoint.mockImplementation(() => ({
                isMobile: false,
            }));
            mockHandleSort.mockImplementation(() => defaultProps.headers[1]);
            renderComponent({
                items: mockItems.map((item) => ({
                    ...item,
                    type: {
                        name: item.type.name !== 'Type 1' ? item.type.name : undefined,
                    }
                })),
            });
            expect(screen.getByTestId('ds-table-data')).toBeInTheDocument();
            const headerComponent = screen.getByTestId('ds-table-header');
            expect(headerComponent).toBeInTheDocument();
            fireEvent.click(headerComponent);
        });

        it('should click in header and call handleSort with order error', () => {
            mockUseBreakpoint.mockImplementation(() => ({
                isMobile: false,
            }));
            mockHandleSort.mockImplementation(() => defaultProps.headers[0]);
            renderComponent({
                items: mockItems,
                sortedColumn: {
                    order: 'error',
                    sort: 'name',
                },
            });
            expect(screen.getByTestId('ds-table-data')).toBeInTheDocument();
            const headerComponent = screen.getByTestId('ds-table-header');
            expect(headerComponent).toBeInTheDocument();
            fireEvent.click(headerComponent);
        });
    });
});