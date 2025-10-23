import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('@repo/services', () => ({
    currencyFormatter: jest.fn((value) => `R$${value}`)
}))

jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children, ...props }: any) => (<div {...props} data-testid="mock-responsive-container">{children}</div>),
    BarChart: ({ children, ...props }: any) => (<div {...props} data-testid="mock-bar-chart-component">{children}</div>),
    CartesianGrid: (props: any) => (<div {...props} data-testid="mock-cartesian-grid"/>),
    XAxis: (props: any) => {
        if (props.tickFormatter) {
            props.tickFormatter(1234);
        }
        return <div {...props} data-testid="mock-x-axis"/>;
    },
    YAxis: (props: any) => {
        if (props.tickFormatter) {
            props.tickFormatter(5678);
        }
        return <div {...props} data-testid="mock-y-axis"/>;
    },
    Tooltip: (props: any) => (<div {...props} data-testid="mock-tooltip"/>),
}));

jest.mock('./bar-chart-content', () => ({
    __esModule: true,
    default: ({ isVertical }: any) => (<div data-testid="mock-bar-chart-content" data-vertical={isVertical} />)
}));

import BarChart from './BarChart';

describe('<BarChart/>', () => {
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

    const mockTooltipContent = jest.fn();

    const defaultProps = {
        data: mockData,
        tooltipContent: mockTooltipContent
    };

    const renderComponent = (props: any = {}) => {
        return render(<BarChart {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-component')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        expect(screen.getByTestId('mock-x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-y-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-content')).toBeInTheDocument();
    });

    it('should render component with type vertical.', () => {
        renderComponent({ type: 'vertical'});
        expect(screen.getByTestId('ds-bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-component')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        expect(screen.getByTestId('mock-x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-y-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-content')).toBeInTheDocument();
    });
});