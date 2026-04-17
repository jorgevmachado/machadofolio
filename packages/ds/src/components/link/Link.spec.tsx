import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../utils', () => {
    const originalModule = jest.requireActual('../../utils');
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

jest.mock('../../elements', () => ({
    Icon: ({ children, ...props }: any) => (<div data-testid="mock-icon" {...props}>{children}</div>),
}));

import Link from './Link';

describe('<Link/>', () => {
    const defaultProps = {
        icon: undefined,
        size: 'medium',
        weight: 'regular',
        context: 'neutral',
        children: 'Hello, World!',
        notification: undefined,
        onClick: jest.fn()
    };

    const renderComponent = (props: any = {}) => {
        return render(<Link {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with default props and children', () => {
        renderComponent();
        const component = screen.getByTestId('ds-link');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-link');
        expect(component).toHaveTextContent('Hello, World!');
        expect(component.tagName).toBe('A');
    });

    it('should apply custom className, context, size and weight', () => {
        renderComponent({ className: 'custom', context: 'success', size: 'sm', weight: 'bold' });
        const link = screen.getByTestId('ds-link');
        expect(link).toHaveClass('custom');
        expect(link).toHaveClass('ds-link__context--success');
        expect(link).toHaveClass('ds-link__size--sm');
        expect(link).toHaveClass('ds-link__weight--bold');
    });

    it('should render an icon on the left by default', () => {
        renderComponent({ icon: { icon: 'home', 'data-testid': 'left-icon' } });
        const icon = screen.getByTestId('left-icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('ds-link__icon--position-left');
    });

    it('should render an icon on the right when position is "right"', () => {
        renderComponent({ icon: { icon: 'right-arrow', position: 'right', 'data-testid': 'right-icon' } });
        const icon = screen.getByTestId('right-icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('ds-link__icon--position-right');
    });

    it('should render icon with extra color and class', () => {
        renderComponent({ icon: { icon: 'ok', color: 'primary', className: 'custom-i', 'data-testid': 'the-icon' } });
        const icon = screen.getByTestId('the-icon');
        expect(icon).toHaveClass('ds-link__icon--position-left');
        expect(icon).toHaveClass('ds-color-primary');
        expect(icon).toHaveClass('custom-i');
    });

    it('should render notification counter correctly', () => {
        renderComponent({ notification: { counter: 3, 'data-testid': 'notif' } });
        const notif = screen.getByTestId('ds-link-notification-counter');
        expect(notif).toBeInTheDocument();
        expect(notif).toHaveTextContent('3');
    });

    it('should display "9+" if notification counter > 9', () => {
        renderComponent({ notification: { counter: 10 } });
        const notif = screen.getByTestId('ds-link-notification-counter');
        expect(notif).toHaveTextContent('9+');
    });

    it('should use notification color, backgroundColor and custom class', () => {
        renderComponent({
            notification: {
                counter: 1,
                color: 'danger',
                backgroundColor: 'yellow',
                className: 'custo-notif'
            }
        });
        const notif = screen.getByTestId('ds-link-notification-counter');
        expect(notif).toHaveClass('ds-color-danger');
        expect(notif).toHaveClass('ds-background-color-yellow');
        expect(notif).toHaveClass('custo-notif');
    });

    it('should fallback notification backgroundColor if not set', () => {
        renderComponent({ context: 'info', notification: { counter: 1, color: 'info' } });
        const notif = screen.getByTestId('ds-link-notification-counter');
        expect(notif).toHaveClass('ds-background-color-info-80');
    });

    it('should fallback notification color to white if not set', () => {
        renderComponent({ notification: { counter: 5 } });
        const notif = screen.getByTestId('ds-link-notification-counter');
        expect(notif).toHaveClass('ds-color-white');
    });

    it('should forward anchor props like href and target', () => {
        renderComponent({ href: 'https://google.com', target: '_blank' });
        const link = screen.getByTestId('ds-link');
        expect(link).toHaveAttribute('href', 'https://google.com');
        expect(link).toHaveAttribute('target', '_blank');
    });

    it('should render only children if no icon and notification are passed', () => {
        renderComponent({ children: <span data-testid="only-child">CH</span> });
        expect(screen.getByTestId('only-child')).toBeInTheDocument();
        expect(screen.queryByTestId('ds-link-notification-counter')).not.toBeInTheDocument();
    });

});