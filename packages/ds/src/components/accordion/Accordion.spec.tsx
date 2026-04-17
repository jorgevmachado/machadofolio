import React from 'react';

import '@testing-library/jest-dom';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils') as Record<string, any>;
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
        generateComponentId: jest.fn(() => 'mock-id'),
    }
});

jest.mock('../../elements', () => ({
    Icon: ({ children, className }: any) => (<div className={className} data-testid="mock-icon">{children}</div>),
    Text: (props: any) => (<p {...props}/>),
}))

import Accordion from './Accordion';

describe('<Accordion/>', () => {
    const defaultProps = {
        title: 'Título',
        children: <div>Conteúdo</div>,
    };

    const renderComponent = (props: any = {}) => {
        return render(<Accordion {...defaultProps} {...props} />);
    };

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByText('Título')).toBeInTheDocument();
        expect(screen.getByText('Título').closest('.ds-accordion')).toBeInTheDocument();
    });

    it('should render with childrenTitle', () => {
        renderComponent({ childrenTitle: <span data-testid="custom-title">Custom</span> });
        expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    });

    it('should render with subtitle', () => {
        renderComponent({ subtitle: 'Subtítulo' });
        expect(screen.getByText('Subtítulo')).toBeInTheDocument();
    });

    it('should render children content when open', () => {
        renderComponent({ isOpen: true });
        expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    });

    it('should not render children content when closed', () => {
        renderComponent({ isOpen: false });
        expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument();
    });

    it('should render as disabled', () => {
        renderComponent({ disabled: true });
        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByRole('presentation')).toHaveClass('ds-accordion__disabled');
    });

    it('should render as borderless', () => {
        renderComponent({ isBorderless: true });
        expect(screen.getByRole('presentation')).toHaveClass('ds-accordion__borderless');
    });

    it('should render with context class', () => {
        renderComponent({ context: 'success' });
        expect(screen.getByRole('presentation')).toHaveClass('ds-accordion__context--success');
    });

    it('should toggle open/close when button is clicked', () => {
        renderComponent();
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText('Conteúdo')).toBeInTheDocument();
        fireEvent.click(button);
        expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument();
    });

    it('should call onToggle when toggled', () => {
        const onToggle = jest.fn();
        renderComponent({ onToggle });
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(onToggle).toHaveBeenCalledWith(true);
        fireEvent.click(button);
        expect(onToggle).toHaveBeenCalledWith(false);
    });

    it('should not open when disabled', () => {
        renderComponent({ disabled: true });
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument();
    });

    it('should have correct aria attributes', () => {
        renderComponent();
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-expanded');
        expect(button).toHaveAttribute('aria-controls');
    });

    it('should rotate icon when open', () => {
        renderComponent({ isOpen: true });
        const icon = screen.getByRole('button').querySelector('.ds-accordion__arrow');
        expect(icon).toHaveClass('ds-accordion__arrow--open');
    });

    it('should not rotate icon when closed', () => {
        renderComponent({ isOpen: false });
        const icon = screen.getByRole('button').querySelector('.ds-accordion__arrow');
        expect(icon).not.toHaveClass('ds-accordion__arrow--open');
    });

    it('should update open state when isOpen prop changes', () => {
        const { rerender } = render(<Accordion title="Título" isOpen={false} children={<div>Conteúdo</div>} />);
        expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument();
        rerender(<Accordion title="Título" isOpen={true} children={<div>Conteúdo</div>} />);
        expect(screen.getByText('Conteúdo')).toBeInTheDocument();
        rerender(<Accordion title="Título" isOpen={false} children={<div>Conteúdo</div>} />);
        expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument();
    });
});