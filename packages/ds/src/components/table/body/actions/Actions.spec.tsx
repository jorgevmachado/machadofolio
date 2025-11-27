import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../../../hooks/use-breakpoint', () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock('./action', () => ({
    __esModule: true,
    default: ({ type, 'data-testid': dataTestId = `ds-table-body-action-${type}`, ...props }: any) => (<button {...props} data-testid={dataTestId}/>),
    Button: ({ type, 'data-testid': dataTestId = `ds-table-body-action-${type}`, ...props }: any) => (<button {...props} data-testid={dataTestId}/>),
}));

import Actions from './Actions';
import useBreakpoint from '../../../../hooks/use-breakpoint';

describe('<Actions/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    const mockEditOnClick = jest.fn();
    const mockDeleteOnClick = jest.fn();
    const defaultProps = {
        item: {
            name: 'John Doe',
            type: {
                name: 'Type 1',
            },
            created_at: '2023-01-01',
        },
        actions: undefined
    }

    const renderComponent = (props: any = {}) => {
        return render(<Actions {...defaultProps} {...props}/>);
    }

    it('should render with default props', () => {
        (useBreakpoint as jest.Mock).mockReturnValue({ isMobile: false });
        renderComponent();
        expect(screen.queryByTestId('ds-table-body-actions')).not.toBeInTheDocument();
    });

    it('should render with actions (desktop)', () => {
        (useBreakpoint as jest.Mock).mockReturnValue({ isMobile: false });
        renderComponent({
            actions: {
                edit: {
                    icon: {icon: 'edit' },
                    context: 'info',
                    onClick: mockEditOnClick
                },
                delete: {
                    icon: {icon: 'edit' },
                    context: 'error',
                    onClick: mockDeleteOnClick
                }
            }
        });
        expect(screen.getByTestId('ds-table-body-actions')).toBeInTheDocument();
        expect(screen.getByTestId('ds-table-body-action-edit')).toBeInTheDocument();
        expect(screen.getByTestId('ds-table-body-action-delete')).toBeInTheDocument();
    });

    it('should render with actions (mobile)', () => {
        (useBreakpoint as jest.Mock).mockReturnValue({ isMobile: true });
        renderComponent({
            actions: {
                edit: {
                    icon: {icon: 'edit' },
                    context: 'info',
                    onClick: mockEditOnClick
                },
                delete: {
                    icon: {icon: 'edit' },
                    context: 'error',
                    onClick: mockDeleteOnClick
                }
            }
        });
        expect(screen.getByTestId('ds-table-body-actions')).toBeInTheDocument();
        expect(screen.queryByTestId('ds-table-body-action-edit')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-table-body-action-delete')).toBeInTheDocument();
    });
});