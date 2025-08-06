import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { Button } from './Button';

jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils') as Record<string, any>;
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

jest.mock('../../elements', () => ({
    Icon: ({ children }: any) => (<div data-testid="mock-icon">{children}</div>),
}));

jest.mock('./Content', () => ({
    __esModule: true,
    Content: ({ children }: any) => (<div data-testid="mock-content">{children}</div>),
    default: ({ children }: any) => (<div data-testid="mock-content">{children}</div>),
}));

describe('<Button/>', () => {
    const defaultProps = {
        size: 'medium',
        weight: 'regular',
        context: 'primary',
        children: 'button text',
        appearance: 'standard',
    }

    const renderComponent = (props: any = {}) => {
        return render(<Button {...defaultProps} {...props} />);
    };

    afterEach(() => {
        cleanup();
        jest.resetModules();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should renders text correctly.', () => {
        renderComponent();
        expect(screen.getByText(/button text/i)).toBeInTheDocument();
    });

    it('should trigger onClick.', () => {
        const onClick = jest.fn();
        renderComponent({ onClick });
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalled();
    });

    it('should disable the button when prop disabled is true.', () => {
        renderComponent({ disabled: true });
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('must apply the correct class for size, weight and context.', () => {
        renderComponent({ size: 'small', weight: 'bold', context: 'error' });
        const button = screen.getByRole('button');
        expect(button).toHaveClass('ds-button__size--small');
        expect(button).toHaveClass('ds-button__weight--bold');
        expect(button).toHaveClass('ds-button__context--error');
    });

    it('must apply class when fluid and rounded.', () => {
        renderComponent({ fluid: true, rounded: true });
        const button = screen.getByRole('button');
        expect(button).toHaveClass('ds-button__fluid');
        expect(button).toHaveClass('ds-button__rounded');
    });

    it('must apply class when focus is selected.', () => {
        renderComponent({ focus: true, selected: true });
        const button = screen.getByRole('button');
        expect(button).toHaveClass('ds-button__focus');
        expect(button).toHaveClass('ds-button__selected');
    });

    it('must apply custom class received by className.', () => {
        renderComponent({ className: 'custom-class' });
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('should change role to `button` when appearance is "icon".', () => {
        renderComponent({ appearance: 'icon', icon: { icon: 'react', noBorder: true, position: 'left' } });
        const button = screen.getByRole('button');
        expect(button).toHaveClass('ds-button__appearance--no-icon-border');
    });

    it('should show icon in left position role to `button` when appearance is "icon" with position undefined.', () => {
        renderComponent({ appearance: 'icon', icon: { icon: 'react', noBorder: true } });
        const button = screen.getByRole('button');
        expect(button).toHaveClass('ds-button__appearance--no-icon-border');
    });

    it('must apply class when there are no children.', () => {
        renderComponent({ children: undefined });
        const button = screen.getByRole('button');
        expect(button).toHaveClass('ds-button__no-label');
    });

    it('should disable the button when loading is true.', () => {
        renderComponent({ loading: { value: true } });
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('must warn if there is no label or aria-label.', () => {
        console.warn = jest.fn();
        render(<Button />);
        expect(console.warn).toHaveBeenCalledWith(
            'You must define the aria-label if the button has no label'
        );
    });

});
