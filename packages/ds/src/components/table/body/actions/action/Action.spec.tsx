import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

// Mock useBreakpoint
jest.mock('../../../../../hooks/use-breakpoint', () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock('../../../../button', () => ({
    __esModule: true,
    default: ({ 'data-testid': dataTestId = 'mock-button', ...props }: any) => (<button {...props} data-testid={dataTestId}/>),
    Button: ({ 'data-testid': dataTestId = 'mock-button', ...props }: any) => (<button {...props} data-testid={dataTestId}/>),
}));

import Action from './Action';
import useBreakpoint from '../../../../../hooks/use-breakpoint';

describe('<Action/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    const defaultProps = {
        item: {
            name: 'John Doe',
            type: {
                name: 'Type 1',
            },
            created_at: '2023-01-01',
        },
        type: 'edit',
        action: {}
    }

    const renderComponent = (props: any = {}) => {
        return render(<Action {...defaultProps} {...props}/>);
    }

    it('should render with default props (desktop)', () => {
        (useBreakpoint as jest.Mock).mockReturnValue({ isMobile: false });
        const type = 'edit';
        renderComponent();
        const button = screen.getByTestId(`ds-table-body-action-${type}`);
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Edit');
    });

    it('should render with type delete (desktop)', () => {
        (useBreakpoint as jest.Mock).mockReturnValue({ isMobile: false });
        const type = 'delete';
        renderComponent({ type });
        const button = screen.getByTestId(`ds-table-body-action-${type}`);
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Delete');
    });

    it('should click button and call action onClick (desktop)', () => {
        (useBreakpoint as jest.Mock).mockReturnValue({ isMobile: false });
        const type = 'edit';
        const mockOnClick = jest.fn();
        renderComponent({
            action: {
                icon: {icon: 'edit' },
                context: 'info',
                onClick: mockOnClick
            }
        });
        const button = screen.getByTestId(`ds-table-body-action-${type}`);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        expect(mockOnClick).toHaveBeenCalled();
    });

    it('should render with default props (mobile)', () => {
        (useBreakpoint as jest.Mock).mockReturnValue({ isMobile: true });
        const type = 'edit';
        renderComponent();
        const button = screen.getByTestId(`ds-table-body-action-${type}`);
        expect(button).toBeInTheDocument();
        // No text content, icon only
        expect(button).not.toHaveTextContent('Edit');
    });

    it('should render with type delete (mobile)', () => {
        (useBreakpoint as jest.Mock).mockReturnValue({ isMobile: true });
        const type = 'delete';
        renderComponent({ type });
        const button = screen.getByTestId(`ds-table-body-action-${type}`);
        expect(button).toBeInTheDocument();
        expect(button).not.toHaveTextContent('Delete');
    });

    it('should click button and call action onClick (mobile)', () => {
        (useBreakpoint as jest.Mock).mockReturnValue({ isMobile: true });
        const type = 'edit';
        const mockOnClick = jest.fn();
        renderComponent({
            action: {
                icon: {icon: 'edit' },
                context: 'info',
                onClick: mockOnClick
            }
        });
        const button = screen.getByTestId(`ds-table-body-action-${type}`);
        expect(button).toBeInTheDocument();
        fireEvent.click(button);
        expect(mockOnClick).toHaveBeenCalled();
    });
});