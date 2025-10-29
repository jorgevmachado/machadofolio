import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('d3-shape', () => ({
    curveCardinal: {
        tension: jest.fn(),
    }
}));

jest.mock('./chart-content', () => ({
    __esModule: true,
    default: (props: any) => (
        <div {...props} data-testid="mock-chart-content">{props.isFallback ? null : props.children}</div>),
    ChartContent: (props: any) => (
        <div {...props} data-testid="mock-chart-content">{props.isFallback ? null : props.children}</div>),
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
            if (props.tooltipContent) {
                props.tooltipContent({});
            }
            return (<div {...props} data-testid="mock-bar-chart"/>)
        },
        PieChart: (props: any) => {
            if (props.tooltipContent) {
                props.tooltipContent({});
            }
            return (<div {...props} data-testid="mock-pie-chart"/>)
        },
        AreaChart: (props: any) => {
            if (props.tooltipContent) {
                props.tooltipContent({});
            }
            return (<div {...props} data-testid="mock-area-chart"/>)
        },
        RadarChart: (props: any) => {
            if (props.tooltipContent) {
                props.tooltipContent({});
            }
            return (<div {...props} data-testid="mock-radar-chart"/>)
        }
    }
});

import SuperChart from './SuperChart';

describe('<SuperChart/>', () => {
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

    describe('BarChart', () => {
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
        ];

        it('should render component with type bar without barChart.', () => {
            renderComponent({ type: 'bar' });
            expect(screen.getByTestId('mock-chart-content')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-bar-chart')).not.toBeInTheDocument();
        });

        it('should render component with type bar and barChart.', () => {
            renderComponent({
                barChart: { data: mockData },
                chartTooltip: { countText: 'expenses', valueText: 'Total' }
            });
            expect(screen.getByTestId('mock-chart-content')).toBeInTheDocument();
            expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
        });
    });

    describe('PieChart', () => {
        it('should render component with type pie without pieChart.', () => {
            renderComponent({ type: 'pie' });
            expect(screen.getByTestId('mock-chart-content')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-pie-chart')).not.toBeInTheDocument();
        });

        it('should render component with type pie and pieChart.', () => {
            renderComponent({
                type: 'pie',
                pieChart: {
                    pies: [
                        {
                            cx: '50%',
                            cy: '50%',
                            key: 'inner',
                            fill: '#8884d8',
                            data: [
                                { name: 'Group A', value: 400 },
                                { name: 'Group B', value: 300 },
                                { name: 'Group C', value: 300 },
                                { name: 'Group D', value: 200 },
                            ],
                            dataKey: 'value',
                            outerRadius: '50%',
                            isAnimationActive: true
                        },
                        {
                            cx: '50%',
                            cy: '50%',
                            key: 'outer',
                            fill: '#82ca9d',
                            data: [
                                { name: 'A1', value: 100 },
                                { name: 'A2', value: 300 },
                                { name: 'B1', value: 100 },
                                { name: 'B2', value: 80 },
                                { name: 'B3', value: 40 },
                                { name: 'B4', value: 30 },
                                { name: 'B5', value: 50 },
                                { name: 'C1', value: 100 },
                                { name: 'C2', value: 200 },
                                { name: 'D1', value: 150 },
                                { name: 'D2', value: 50 },
                            ],
                            label: true,
                            dataKey: 'value',
                            innerRadius: '60%',
                            outerRadius: '80%',
                            isAnimationActive: true
                        }
                    ]
                },
                chartTooltip: { countText: 'expenses', valueText: 'Total' }
            });
            expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();

        });
    });

    describe('AreaChart', () => {
        it('should render component with type area without areaChart.', () => {
            renderComponent({ type: 'area' });
            expect(screen.getByTestId('mock-chart-content')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-area-chart')).not.toBeInTheDocument();
        });

        it('should render component with type area and areaChart.', () => {
            renderComponent({
                type: 'area',
                areaChart: {
                    areas: [
                        {
                            name: 'Page A',
                            uv: 4000,
                            pv: 2400,
                            amt: 2400,
                        },
                        {
                            name: 'Page B',
                            uv: 3000,
                            pv: 1398,
                            amt: 2210,
                        },
                        {
                            name: 'Page C',
                            uv: 2000,
                            pv: 9800,
                            amt: 2290,
                        },
                        {
                            name: 'Page D',
                            uv: 2780,
                            pv: 3908,
                            amt: 2000,
                        },
                        {
                            name: 'Page E',
                            uv: 1890,
                            pv: 4800,
                            amt: 2181,
                        },
                        {
                            name: 'Page F',
                            uv: 2390,
                            pv: 3800,
                            amt: 2500,
                        },
                        {
                            name: 'Page G',
                            uv: 3490,
                            pv: 4300,
                            amt: 2100,
                        },
                    ],
                    labels: [{
                        key: 'uv',
                        fill: '#8884d8',
                        type: 'monotone',
                        stroke: '#8884d8',
                        dataKey: 'uv'
                    }],
                    responsive: true
                },
                chartTooltip: { countText: 'expenses', valueText: 'Total' }
            });
            expect(screen.getByTestId('mock-area-chart')).toBeInTheDocument();

        });
    });
});