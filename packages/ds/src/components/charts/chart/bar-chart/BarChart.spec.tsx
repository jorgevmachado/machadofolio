import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

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
    Legend: (props: any) => (<div {...props} data-testid="mock-legend"/>),
}));

jest.mock('./bar-content', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-bar-chart-content" />)
}));
jest.mock('../../../../hooks', () => ({
    useBreakpoint: jest.fn(() => ({ isMobile: false }))
}));

import BarChart from './BarChart';

describe('<BarChart/>', () => {

    const mockTooltipContent = jest.fn();

    const defaultProps = {
        axis: {
            xList: [{ key: 'x-axis-0', dataKey: 'name' }],
            yList: [{ key: 'y-axis-0', width: 'auto' }],
        },
        data: [
            {
                type: 'bank',
                name: 'Nubank',
                value: 400,
                count: 4,
                fill: '#9c44dc',
                color: '#bc8ae1',
                stroke: '#442c61',
            },
            {
                type: 'bank',
                name: 'Caixa',
                value: 300,
                count: 3,
                fill: '#002060',
                color: '#FF9933',
                stroke: '#3b82f6'
            },
            {
                type: 'bank',
                name: 'Itaú',
                value: 200,
                count: 2,
                fill: '#F88104',
                color: '#FF6200',
                stroke: '#004387'
            },
            {
                type: 'bank',
                name: 'Santander',
                value: 100,
                count: 1,
                fill: '#EA1D25',
                color: '#c2c2c2',
                stroke: '#333333'
            },
        ],
        tooltip: {
            content: mockTooltipContent
        },
        labels: [{ key: 'value', fill: '#808080', activeBar: { type: 'rectangle' } }],
    }

    const renderComponent = (props: any = {}, breakpoint: any = { isMobile: false }) => {
        (require('../../../../hooks').useBreakpoint as jest.Mock).mockReturnValue(breakpoint);
        render(<BarChart {...defaultProps} {...props}/>)
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
        expect(screen.getByTestId('mock-responsive-container')).toHaveAttribute('height', '310');
        expect(screen.getByTestId('mock-bar-chart-component')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        expect(screen.getByTestId('mock-x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-y-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-content')).toBeInTheDocument();
    });

    it('should render component with props default (mobile).', () => {
        renderComponent({}, { isMobile: true });
        expect(screen.getByTestId('ds-bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('mock-responsive-container')).toHaveAttribute('height', '220');
        expect(screen.getByTestId('mock-bar-chart-component')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        expect(screen.getByTestId('mock-x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-y-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-content')).toBeInTheDocument();
    });

    it('should render component with top.', () => {
        renderComponent({ top: 5 });
        expect(screen.getByTestId('ds-bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-component')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        expect(screen.getByTestId('mock-x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-y-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-content')).toBeInTheDocument();
    });

    it('should render component with xAxis and yAxis.', () => {
        renderComponent({ xAxis: [{ dataKey: 'name' }], yAxis: [{ width: 'auto' }] });
        expect(screen.getByTestId('ds-bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-component')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        expect(screen.getByTestId('mock-x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-x-axis')).toHaveAttribute('dataKey', 'name');
        expect(screen.getByTestId('mock-y-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-y-axis')).toHaveAttribute('width', 'auto');
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-content')).toBeInTheDocument();
    });

    it('should render component with withCurrencyTickFormatter.', () => {
        renderComponent({ withCurrencyTickFormatter: true });
        expect(screen.getByTestId('ds-bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-component')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        expect(screen.getByTestId('mock-x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-y-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-content')).toBeInTheDocument();
    });

    it('should render component with layout horizontal.', () => {
        renderComponent({
            axis: {
                xList: [{ key: 'x-axis-0', type: 'number' }],
                yList: [{ key: 'y-axis-0', type: 'category', width: 90, dataKey: 'name' }],
            },
            layout: 'horizontal',
            legend: undefined,
            tooltip: undefined,

        });
        expect(screen.getByTestId('ds-bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-component')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        const xAxisComponent = screen.getByTestId('mock-x-axis');
        expect(xAxisComponent).toBeInTheDocument();
        expect(xAxisComponent).toHaveAttribute('type', 'number');

        const yAxisComponent = screen.getByTestId('mock-y-axis');
        expect(yAxisComponent).toBeInTheDocument();
        expect(yAxisComponent).toHaveAttribute('width', '90');
        expect(yAxisComponent).toHaveAttribute('type', 'category');

        expect(screen.getByTestId('mock-bar-chart-content')).toBeInTheDocument();
    });

    it('should render component with layout horizontal and withCurrencyTickFormatter.', () => {
        renderComponent({
            axis: {
                xList: [{ key: 'x-axis-0', type: 'number', tickFormatter: jest.fn() }],
                yList: [{ key: 'y-axis-0', type: 'category', width: 90, dataKey: 'name', tickFormatter: jest.fn() }],
            },
            layout: 'horizontal',
        });
        expect(screen.getByTestId('ds-bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-component')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        const xAxisComponent = screen.getByTestId('mock-x-axis');
        expect(xAxisComponent).toBeInTheDocument();
        expect(xAxisComponent).toHaveAttribute('type', 'number');

        const yAxisComponent = screen.getByTestId('mock-y-axis');
        expect(yAxisComponent).toBeInTheDocument();
        expect(yAxisComponent).toHaveAttribute('width', '90');
        expect(yAxisComponent).toHaveAttribute('type', 'category');

        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('mock-bar-chart-content')).toBeInTheDocument();
    });

    it('should render component with legend', () => {
        renderComponent({ legend: { show: true }});
        expect(screen.getByTestId('mock-legend')).toBeInTheDocument();
    });
    
    it('should render component with custom colors', () => {
        const customData = [
            {
                type: 'bank',
                name: 'Nubank',
                value: 400,
                count: 4
            }
        ];
        renderComponent({ data: customData });
        expect(screen.getByTestId('ds-bar-chart')).toBeInTheDocument();
    })
    
})