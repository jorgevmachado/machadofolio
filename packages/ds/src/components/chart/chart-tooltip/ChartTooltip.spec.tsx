import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('@repo/services', () => ({
    currencyFormatter: jest.fn((value) => `R$${value}`)
}));

jest.mock('../../../elements', () => ({
    Text: (props: any) => (<p {...props}/>),
}));

import ChartTooltip from './ChartTooltip';

describe('<ChartTooltip/>', () => {
    const defaultProps = {};

    const mockPayload = {
            type: 'bank',
            name: 'Nubank',
            value: 400,
            count: 4,
            percentageTotal: 80,
    };

    const renderComponent = (props: any = {}) => {
        return render(<ChartTooltip {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.queryByTestId('ds-chart-tooltip')).not.toBeInTheDocument();
    });

    it('should render component with active tooltip and payload.', () => {
        renderComponent({ active: true, payload: [{ payload: mockPayload } ]});
        expect(screen.getByTestId('ds-chart-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-tooltip-name')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-tooltip-value')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-tooltip-count')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-tooltip-percentage')).toBeInTheDocument();
    });

    it('should render component with with payload in payload undefined.', () => {
        renderComponent({ active: true, payload: [{ payload: undefined } ]});
        expect(screen.getByTestId('ds-chart-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-tooltip-name')).toBeInTheDocument();
        expect(screen.getByTestId('ds-chart-tooltip-value')).toBeInTheDocument();
    });
})