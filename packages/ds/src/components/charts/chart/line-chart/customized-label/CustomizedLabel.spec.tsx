import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

import CustomizedLabel from './CustomizedLabel';

describe('<CustomizedLabel/>', () => {
    const defaultProps = {
        x: 48,
        y: 267,
        value: 2400,
    }

    const renderComponent = (props = {}) => {
        return render(<CustomizedLabel {...defaultProps } {...props} />);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        const component = screen.getByTestId('ds-line-chart-customized-label-text');
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('x', '48');
        expect(component).toHaveAttribute('y', '267');
        expect(component).toHaveAttribute('dy', '-4');
        expect(component).toHaveTextContent('2400');
    });

    it('should render component with custom label.', () => {
        renderComponent({
            customLabel: {
                dy: -10,
                fill: 'red',
                fontSize: 14,
                textAnchor: 'start'
            }
        });
        const component = screen.getByTestId('ds-line-chart-customized-label-text');
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('x', '48');
        expect(component).toHaveAttribute('y', '267');
        expect(component).toHaveAttribute('dy', '-10');
        expect(component).toHaveAttribute('fill', 'red');
        expect(component).toHaveTextContent('2400');
    });
});