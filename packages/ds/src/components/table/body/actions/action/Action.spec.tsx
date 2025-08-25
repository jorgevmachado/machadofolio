import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../../../button', () => ({
    __esModule: true,
    default: ({ 'data-testid': dataTestId = 'mock-button', ...props }: any) => (<button {...props} data-testid={dataTestId}/>),
    Button: ({ 'data-testid': dataTestId = 'mock-button', ...props }: any) => (<button {...props} data-testid={dataTestId}/>),
}));

import Action from './Action';

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

    it('should render with default props', () => {
        const type = 'edit';
        renderComponent();
        const button = screen.getByTestId(`ds-table-body-action-${type}`);
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Edit');
    });

    it('should render with type delete', () => {
        const type = 'delete';
        renderComponent({ type });
        const button = screen.getByTestId(`ds-table-body-action-${type}`);
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Delete');
    });

    it('should click button and call action onClick', () => {
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
    })
});