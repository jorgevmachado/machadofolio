import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

jest.mock('../../elements', () => ({
    Icon: ({ children, onClick, 'data-testid': dataTestId, ...props }: any) => (
        <span {...props} data-testid={dataTestId} onClick={onClick}/>
    ),
}));

import Alert from './Alert';

describe('<Alert/>', () => {
    const defaultProps = {
        type: 'info',
        children: 'Default Alert',
    };

    const renderComponent = (props: any = {}) => {
        return render(<Alert {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-alert');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-alert');
        expect(component).toHaveClass('ds-alert__type--info');
        expect(component).toHaveAttribute('aria-live', 'polite');
        expect(component).toHaveTextContent(defaultProps.children);
    });

    it('must render each alert type and aria-live assertive for error/warning.', () => {
        const params = [
            { type: 'info', ariaLive: 'polite' },
            { type: 'error', ariaLive: 'assertive' },
            { type: 'warning', ariaLive: 'assertive' },
            { type: 'success', ariaLive: 'polite'  }
        ];
        params.forEach(({ type, ariaLive }) => {
            renderComponent({ type });
            const component = screen.getByTestId('ds-alert');
            expect(component).toHaveClass(`ds-alert__type--${type}`);
            expect(component).toHaveTextContent(defaultProps.children);
            expect(component).toHaveAttribute('aria-live', ariaLive);
            cleanup();
        });
    });

    it('should render with link and fire onClick.', () => {
        const mockOnClick = jest.fn();
        renderComponent({ link: { label: 'Click Here', onClick: mockOnClick } });
        const link = screen.getByTestId('ds-alert-link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveTextContent('Click Here');
        link.click();
        expect(mockOnClick).toHaveBeenCalled();
    });

    it('should render with custom icon.', () => {
        renderComponent({ icon: 'lamp'})
        const component = screen.getByTestId('ds-alert');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-alert');
        expect(component).toHaveClass('ds-alert__type--info');
        expect(component).toHaveAttribute('aria-live', 'polite');
        expect(component).toHaveTextContent(defaultProps.children);
    });

    it('must activate the link with the ENTER key.', () => {
        const mockOnClick = jest.fn();
        renderComponent({ link: { label: 'Click Here', onClick: mockOnClick } });
        const link = screen.getByTestId('ds-alert-link');
        link.focus();
        fireEvent.keyDown(link, { key: 'Enter', code: 'Enter' });
        expect(mockOnClick).toHaveBeenCalled();
    });

    it('should render with close button and fire onClose,', () => {
        const mockOnClose = jest.fn();
        renderComponent({ type: 'warning', onClose: mockOnClose });
        const component = screen.getByTestId('ds-alert');
        expect(component).toHaveClass('ds-alert__borderless');
        expect(component).toHaveClass('ds-alert__type--warning');
        expect(component).toHaveAttribute('aria-live', 'assertive');
        const closeIconButton = screen.getByTestId('ds-alert-icon-close');
        closeIconButton.click();
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('must accept extra props, such as className, id and custom data-testid.', () => {
        renderComponent({ type: 'success', className: 'custom-class', id: 'alert-id', 'data-testid': 'custom-alert', children: (<p>Custom</p>) });
        const component = screen.getByTestId('custom-alert');
        expect(component).toHaveClass('ds-alert');
        expect(component).toHaveClass('custom-class');
        expect(component).toHaveAttribute('id', 'alert-id');
    });
});