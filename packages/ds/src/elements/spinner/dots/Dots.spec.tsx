import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('../../../utils', () => {
    const originalModule = jest.requireActual('../../../utils');
    return {
        ...originalModule,
        joinClass: (classes: string[]) => classes.filter(Boolean).join(' '),
    }
});

import SpinnerDots from './Dots';

describe('<Dots/>', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    const defaultProps = {
        size: 32,
        context: 'primary',
    };

    const renderComponent = (props: any = {}) => {
        return render(<SpinnerDots {...defaultProps} {...props} data-testid="ds-spinner"/>);
    }

    it('should render component props default.', () => {
        const dots = Array.from({ length: 3 }, (_, i) => i);
        renderComponent();
        const spinnerDots = screen.getByTestId('ds-spinner-dots');
        expect(spinnerDots).toBeInTheDocument();
        dots.forEach((index) => {
            const spinnerDotsItem = screen.getByTestId(`ds-spinner-dots-item-${index}`)
            expect(spinnerDotsItem).toHaveClass('ds-spinner-dots');
            expect(spinnerDotsItem).toHaveClass('ds-spinner-dots__context--primary');
        });
    });

    it('should render component props with quantity equal to 0.', () => {
        const dots = Array.from({ length: 3 }, (_, i) => i);
        renderComponent({ quantity: 0 });
        const spinnerDots = screen.getByTestId('ds-spinner-dots');
        expect(spinnerDots).toBeInTheDocument();
        dots.forEach((index) => {
            const spinnerDotsItem = screen.getByTestId(`ds-spinner-dots-item-${index}`)
            expect(spinnerDotsItem).toHaveClass('ds-spinner-dots');
            expect(spinnerDotsItem).toHaveClass('ds-spinner-dots__context--primary');
        });
    });

    it('should render component props with quantity equal to 10.', () => {
        const dots = Array.from({ length: 10 }, (_, i) => i);
        renderComponent({ quantity: 10 });
        const spinnerDots = screen.getByTestId('ds-spinner-dots');
        expect(spinnerDots).toBeInTheDocument();
        dots.forEach((index) => {
            const spinnerDotsItem = screen.getByTestId(`ds-spinner-dots-item-${index}`)
            expect(spinnerDotsItem).toHaveClass('ds-spinner-dots');
            expect(spinnerDotsItem).toHaveClass('ds-spinner-dots__context--primary');
        });
    });
})