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

import ProgressIndicator from './ProgressIndicator';

describe('<ProgressIndicator/>', () => {
    const defaultProps = {
        total: 7,
        current: 3,
    };

    const renderComponent = (props: any = {}) => {
        return render(<ProgressIndicator {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render the wrapper with the base class and data-testid.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-progress-indicator');
        expect(component).toBeInTheDocument();
        expect(component).toHaveClass('ds-progress-indicator');
    });

    it('should apply additional classes passed through className', () => {
        renderComponent({ className: 'custom-class' });
        expect(screen.getByTestId('ds-progress-indicator')).toHaveClass('custom-class');
    });

    it('should render the correct number of indicators', () => {
        renderComponent();
        Array.from({ length: 7 }, (_, index ) => {
            expect(screen.getByTestId(`ds-progress-indicator-item-${index + 1}`)).toBeInTheDocument();
        })
        const spans = screen.getAllByText((_c, el) => el?.tagName === 'SPAN');
        expect(spans.length).toBe(7);
    });

    it('should mark only the current item with the context class', () => {
        renderComponent({ total: 3, current: 2, context: 'success' });
        const spans = screen.getAllByText((_c, el) => el?.tagName === 'SPAN');
        spans.forEach((span, idx) => {
            if (idx === 1) {
                expect(span.className).toContain('ds-progress-indicator__item--context-success');
            } else {
                expect(span.className).not.toContain('ds-progress-indicator__item--context-success');
            }
        });
    });

    it('should pass additional attributes to the wrapper', () => {
        renderComponent({ total: 1, current: 1, 'data-custom': 'data-custom-test', 'aria-label': 'indicator' });
        const wrapper = screen.getByTestId('ds-progress-indicator');
        expect(wrapper).toHaveAttribute('data-custom', 'data-custom-test');
        expect(wrapper).toHaveAttribute('aria-label', 'indicator');
    });

    it('should not mark any item if current is out of range', () => {
        renderComponent({ total: 3, current: 10 });
        const spans = screen.getAllByText((_c, el) => el?.tagName === 'SPAN');
        spans.forEach(span => {
            expect(span.className).not.toMatch(/ds-progress-indicator__item--context-/);
        });
    });

    it('should work correctly when current is 0', () => {
        renderComponent({ total: 3, current: 0 });
        const spans = screen.getAllByText((_c, el) => el?.tagName === 'SPAN');
        spans.forEach(span => {
            expect(span.className).not.toMatch(/ds-progress-indicator__item--context-/);
        });
    });

    it('should not crash if total is 0', () => {
        renderComponent({ total: 0, current: 1 });
        const spans = screen.queryAllByText((_c, el) => el?.tagName === 'SPAN');
        expect(spans.length).toBe(0);
    });
});