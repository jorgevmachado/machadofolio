import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

import CustomizedAxisTick from './CustomizedAxisTick';

describe('<CustomizedAxisTick/>', () => {
    const defaultProps = {
        x: 60,
        y: 371,
        payload: { value: 'Page A'}
    }

    const renderComponent = (props = {}) => {
        return render(<CustomizedAxisTick {...defaultProps } {...props} />);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-line-chart-customized-axis-tick')).toBeInTheDocument();
        const componentText = screen.getByTestId('ds-line-chart-customized-axis-tick-text');
        expect(componentText).toBeInTheDocument();
        expect(componentText).toHaveAttribute('x', '0');
        expect(componentText).toHaveAttribute('y', '0');
        expect(componentText).toHaveAttribute('dy', '16');
        expect(componentText).toHaveAttribute('transform', 'rotate(-35)');
    });

    it('should render component with custom axis tick.', () => {
        renderComponent({ customAxisTick: { x: 10, y: 20, dy: 30, transform: 'rotate(-50)' } });
        expect(screen.getByTestId('ds-line-chart-customized-axis-tick')).toBeInTheDocument();
        const componentText = screen.getByTestId('ds-line-chart-customized-axis-tick-text');
        expect(componentText).toBeInTheDocument();
        expect(componentText).toHaveAttribute('x', '10');
        expect(componentText).toHaveAttribute('y', '20');
        expect(componentText).toHaveAttribute('dy', '30');
        expect(componentText).toHaveAttribute('transform', 'rotate(-50)');
    });
});