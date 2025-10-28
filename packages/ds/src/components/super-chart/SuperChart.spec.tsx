import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('./chart-content', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-chart-content">{props.isFallback ? null : props.children}</div>),
    ChartContent: (props: any) => (<div {...props} data-testid="mock-chart-content">{props.isFallback ? null : props.children}</div>),
}));

jest.mock('./chart-tooltip', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-chart-tooltip"/>),
    ChartTooltip: (props: any) => (<div {...props} data-testid="mock-chart-tooltip"/>),
}));

jest.mock('./charts', () => {
    const originalModule = jest.requireActual('./charts') as Record<string, any>;
    return {
        ...originalModule,
        BarChart: (props: any) => {
            if(props.tooltipContent) {
                props.tooltipContent({});
            }
            return (<div {...props} data-testid="mock-bar-chart"/>)
        },
    }
})

import SuperChart from './SuperChart';

describe('<SuperChart/>', () => {

    const mockData = [
        {
            type: 'bank',
            name: 'Nubank',
            value: 400,
            count: 4
        },
        {
            type: 'bank',
            name: 'Caixa',
            value: 300,
            count: 3
        },
        {
            type: 'bank',
            name: 'Itaú',
            value: 200,
            count: 2
        },
        {
            type: 'bank',
            name: 'Santander',
            value: 100,
            count: 1
        },
    ]
    const defaultProps = {
        type: 'bar',
        title: 'Super Chart Title',
        barChart: {
            data: [],
        },
    };

    const renderComponent = (props: any = {}) => {
        return render(<SuperChart {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('mock-chart-content')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-bar-chart')).not.toBeInTheDocument();
    });

    it('should render component with type pie.', () => {
        renderComponent({ type: 'pie' });
        expect(screen.getByTestId('mock-chart-content')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-bar-chart')).not.toBeInTheDocument();
    });

    it('should render component with type bar and barChart.', () => {
        renderComponent({ barChart: { data: mockData }, chartTooltip: { countText: 'expenses', valueText: 'Total' } });
        expect(screen.getByTestId('mock-chart-content')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    });
});