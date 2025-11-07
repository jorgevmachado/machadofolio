import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('d3-shape', () => ({
    curveCardinal: {
        tension: jest.fn(),
    }
}));

jest.mock('./chart-container', () => ({
    __esModule: true,
    default: (props: any) => (
        <div {...props} data-testid="mock-chart-container">{props.isFallback ? null : props.children}</div>),
    ChartContainer: (props: any) => (
        <div {...props} data-testid="mock-chart-container">{props.isFallback ? null : props.children}</div>),
}));

jest.mock('./content', () => ({
    ChartContentTooltip: (props: any) => (<div {...props} data-testid="mock-chart-tooltip"/>),
    ChartContentLegend: (props: any) => (<div {...props} data-testid="mock-chart-legend"/>),
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
            return <div {...props} data-testid="mock-pie-chart"/>;
        },
        AreaChart: (props: any) => {
            if (props.tooltipContent) {
                props.tooltipContent({});
            }
            return <div {...props} data-testid="mock-area-chart"/>;
        },
        RadarChart: (props: any) => {
            if (props.tooltipContent) {
                props.tooltipContent({});
            }
            return <div {...props} data-testid="mock-radar-chart"/>;
        },
        RadialChart: (props: any) => {
            if (props.tooltipContent) {
                props.tooltipContent({});
            }
            return <div {...props} data-testid="mock-radial-chart"/>;
        },
        LineChart: (props: any) => {
            if (props.tooltipContent) {
                props.tooltipContent({});
            }
            return <div {...props} data-testid="mock-line-chart"/>;
        },
        ScatterChart: (props: any) => {
            if (props.tooltipContent) {
                props.tooltipContent({});
            }
            return <div {...props} data-testid="mock-scatter-chart"/>;
        },
        ComposedChart: (props: any) => {
            let tooltipContent = null;
            let legendContent = null;
            if (props.tooltip) {
                if (typeof props.tooltip.content === 'function') {
                    tooltipContent = props.tooltip.content({});
                } else if (props.tooltip.filterContent) {
                    tooltipContent = (
                        <div data-testid="mock-filtered-chart">
                            <div data-testid="mock-filtered-tooltip" />
                        </div>
                    );
                }
            }

            if (props.legend) {
                if (typeof props.legend.content === 'function') {
                    legendContent = props.legend.content({});
                } else if (props.legend.filterContent) {
                    legendContent = (
                        <div data-testid="mock-filtered-chart">
                            <div data-testid="mock-legend-tooltip" />
                        </div>
                    );
                }
            }
            return (
                <div {...props} data-testid="mock-composed-chart">
                    {tooltipContent}
                    {legendContent}
                </div>
            );
        }
    }
});

jest.mock('./utils', () => ({
    buildTooltip: (tooltip: any) => tooltip,
    buildLegend: (legend: any) => legend,
    buildAxis: () => jest.fn(),
}));

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
        expect(screen.getByTestId('mock-chart-container')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-bar-chart')).not.toBeInTheDocument();
    });

    it('should render component with type different', () => {
        renderComponent({
            type: 'other',
            legend: { content: <h1>content</h1> },
            tooltip: { content: <h1>content</h1> },
        });
        expect(screen.getByTestId('mock-chart-container')).toBeInTheDocument();
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
            expect(screen.getByTestId('mock-chart-container')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-bar-chart')).not.toBeInTheDocument();
        });

        it('should render component with type bar and barChart.', () => {
            renderComponent({
                barChart: { data: mockData },
                tooltip: { countProps: {text: 'expenses' }, valueProps: { text: 'Total'} }
            });
            expect(screen.getByTestId('mock-chart-container')).toBeInTheDocument();
            expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
        });

        it('should render component with type bar and  without tooltip.', () => {
            renderComponent({
                barChart: { data: mockData },
            });
            expect(screen.getByTestId('mock-chart-container')).toBeInTheDocument();
            expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
        });
    });

    describe('PieChart', () => {
        it('should render component with type pie without pieChart.', () => {
            renderComponent({ type: 'pie' });
            expect(screen.getByTestId('mock-chart-container')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-pie-chart')).not.toBeInTheDocument();
        });

        it('should render component with type pie and pieChart.', () => {
            renderComponent({
                type: 'pie',
                pieChart: {
                    data: [
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
                tooltip: { countProps: {text: 'expenses' }, valueProps: { text: 'Total'} }
            });
            expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();

        });

        it('should render component with type pie and  without tooltip.', () => {
            renderComponent({
                type: 'pie',
                pieChart: {
                    data: [
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
            });
            expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();

        });
    });

    describe('AreaChart', () => {
        it('should render component with type area without areaChart.', () => {
            renderComponent({ type: 'area' });
            expect(screen.getByTestId('mock-chart-container')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-area-chart')).not.toBeInTheDocument();
        });

        it('should render component with type area and areaChart.', () => {
            renderComponent({
                type: 'area',
                areaChart: {
                    data: [
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
                tooltip: { countProps: {text: 'expenses' }, valueProps: { text: 'Total'} }
            });
            expect(screen.getByTestId('mock-area-chart')).toBeInTheDocument();

        });

        it('should render component with type area and  without tooltip.', () => {
            renderComponent({
                type: 'area',
                areaChart: {
                    data: [
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
            });
            expect(screen.getByTestId('mock-area-chart')).toBeInTheDocument();

        });
    });

    describe('RadarChart', () => {
        it('should render component with type radar without radarChart.', () => {
            renderComponent({ type: 'radar' });
            expect(screen.getByTestId('mock-chart-container')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-radar-chart')).not.toBeInTheDocument();
        });

        it('should render component with type radar and radarChart.', () => {
            renderComponent({
                type: 'radar',
                radarChart: {
                    data: [
                        {
                            name: '18-24',
                            uv: 31.47,
                            pv: 2400,
                            fill: '#8884d8',
                        },
                        {
                            name: '25-29',
                            uv: 26.69,
                            pv: 4567,
                            fill: '#83a6ed',
                        },
                        {
                            name: '30-34',
                            uv: 15.69,
                            pv: 1398,
                            fill: '#8dd1e1',
                        },
                        {
                            name: '35-39',
                            uv: 8.22,
                            pv: 9800,
                            fill: '#82ca9d',
                        },
                        {
                            name: '40-49',
                            uv: 8.63,
                            pv: 3908,
                            fill: '#a4de6c',
                        },
                        {
                            name: '50+',
                            uv: 2.63,
                            pv: 4800,
                            fill: '#d0ed57',
                        },
                        {
                            name: 'unknown',
                            uv: 6.67,
                            pv: 4800,
                            fill: '#ffc658',
                        },
                    ],
                    labels:  [{
                        key: 'uv',
                        fill: '#fff',
                        dataKey: 'uv',
                        position: 'insideStart',
                        background: true
                    }],
                    responsive: true
                },
                tooltip: { countProps: {text: 'expenses' }, valueProps: { text: 'Total'} }
            });
            expect(screen.getByTestId('mock-radar-chart')).toBeInTheDocument();
        });

        it('should render component with type radar and  without tooltip.', () => {
            renderComponent({
                type: 'radar',
                radarChart: {
                    data: [
                        {
                            name: '18-24',
                            uv: 31.47,
                            pv: 2400,
                            fill: '#8884d8',
                        },
                        {
                            name: '25-29',
                            uv: 26.69,
                            pv: 4567,
                            fill: '#83a6ed',
                        },
                        {
                            name: '30-34',
                            uv: 15.69,
                            pv: 1398,
                            fill: '#8dd1e1',
                        },
                        {
                            name: '35-39',
                            uv: 8.22,
                            pv: 9800,
                            fill: '#82ca9d',
                        },
                        {
                            name: '40-49',
                            uv: 8.63,
                            pv: 3908,
                            fill: '#a4de6c',
                        },
                        {
                            name: '50+',
                            uv: 2.63,
                            pv: 4800,
                            fill: '#d0ed57',
                        },
                        {
                            name: 'unknown',
                            uv: 6.67,
                            pv: 4800,
                            fill: '#ffc658',
                        },
                    ],
                    labels:  [{
                        key: 'uv',
                        fill: '#fff',
                        dataKey: 'uv',
                        position: 'insideStart',
                        background: true
                    }],
                    responsive: true
                },
            });
            expect(screen.getByTestId('mock-radar-chart')).toBeInTheDocument();
        });
    });

    describe('RadialChart', () => {
        it('should render component with type radial without radialChart.', () => {
            renderComponent({ type: 'radial' });
            expect(screen.getByTestId('mock-chart-container')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-radial-chart')).not.toBeInTheDocument();
        });

        it('should render component with type radial and radialChart.', () => {
            renderComponent({
                type: 'radial',
                radialChart: {
                    data: [
                        {
                            name: '18-24',
                            uv: 31.47,
                            pv: 2400,
                            fill: '#8884d8',
                        },
                        {
                            name: '25-29',
                            uv: 26.69,
                            pv: 4567,
                            fill: '#83a6ed',
                        },
                        {
                            name: '30-34',
                            uv: 15.69,
                            pv: 1398,
                            fill: '#8dd1e1',
                        },
                        {
                            name: '35-39',
                            uv: 8.22,
                            pv: 9800,
                            fill: '#82ca9d',
                        },
                        {
                            name: '40-49',
                            uv: 8.63,
                            pv: 3908,
                            fill: '#a4de6c',
                        },
                        {
                            name: '50+',
                            uv: 2.63,
                            pv: 4800,
                            fill: '#d0ed57',
                        },
                        {
                            name: 'unknown',
                            uv: 6.67,
                            pv: 4800,
                            fill: '#ffc658',
                        },
                    ],
                    labels:  [{
                        key: 'uv',
                        fill: '#fff',
                        dataKey: 'uv',
                        position: 'insideStart',
                        background: true
                    }],
                    responsive: true
                },
                tooltip: { countProps: {text: 'expenses' }, valueProps: { text: 'Total'} }
            });
            expect(screen.getByTestId('mock-radial-chart')).toBeInTheDocument();

        });

        it('should render component with type radial and  without tooltip.', () => {
            renderComponent({
                type: 'radial',
                radialChart: {
                    data: [
                        {
                            name: '18-24',
                            uv: 31.47,
                            pv: 2400,
                            fill: '#8884d8',
                        },
                        {
                            name: '25-29',
                            uv: 26.69,
                            pv: 4567,
                            fill: '#83a6ed',
                        },
                        {
                            name: '30-34',
                            uv: 15.69,
                            pv: 1398,
                            fill: '#8dd1e1',
                        },
                        {
                            name: '35-39',
                            uv: 8.22,
                            pv: 9800,
                            fill: '#82ca9d',
                        },
                        {
                            name: '40-49',
                            uv: 8.63,
                            pv: 3908,
                            fill: '#a4de6c',
                        },
                        {
                            name: '50+',
                            uv: 2.63,
                            pv: 4800,
                            fill: '#d0ed57',
                        },
                        {
                            name: 'unknown',
                            uv: 6.67,
                            pv: 4800,
                            fill: '#ffc658',
                        },
                    ],
                    labels:  [{
                        key: 'uv',
                        fill: '#fff',
                        dataKey: 'uv',
                        position: 'insideStart',
                        background: true
                    }],
                    responsive: true
                },
            });
            expect(screen.getByTestId('mock-radial-chart')).toBeInTheDocument();

        });
    });

    describe('LineChart', () => {
        it('should render component with type line without lineChart.', () => {
            renderComponent({ type: 'line' });
            expect(screen.getByTestId('mock-chart-container')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-line-chart')).not.toBeInTheDocument();
        });

        it('should render component with type line and lineChart.', () => {
            renderComponent({
                type: 'line',
                lineChart: {
                    data: [
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
                    labels: [
                        {
                            key: 'pv',
                            type: 'monotone',
                            stroke: '#8884d8',
                            dataKey: 'pv',
                            activeDot: { r: 8 },
                        },
                        {
                            key: 'uv',
                            type: 'monotone',
                            stroke: '#82ca9d',
                            dataKey: 'uv',
                        }
                    ],
                    responsive: true,
                },
                tooltip: { countProps: {text: 'expenses' }, valueProps: { text: 'Total'} }
            });
            expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
        });

        it('should render component with type line and  without tooltip.', () => {
            renderComponent({
                type: 'line',
                lineChart: {
                    data: [
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
                    labels: [
                        {
                            key: 'pv',
                            type: 'monotone',
                            stroke: '#8884d8',
                            dataKey: 'pv',
                            activeDot: { r: 8 },
                        },
                        {
                            key: 'uv',
                            type: 'monotone',
                            stroke: '#82ca9d',
                            dataKey: 'uv',
                        }
                    ],
                    responsive: true,
                },
            });
            expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
        });
    });

    describe('ScatterChart', () => {
        const mockData = [
            { x: 100, y: 200, z: 200 },
            { x: 120, y: 100, z: 260 },
            { x: 170, y: 300, z: 400 },
            { x: 140, y: 250, z: 280 },
            { x: 150, y: 400, z: 500 },
            { x: 110, y: 280, z: 200 },
        ];
        it('should render component with type scatter without scatterChart.', () => {
            renderComponent({ type: 'scatter' });
            expect(screen.getByTestId('mock-chart-container')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-scatter-chart')).not.toBeInTheDocument();
        });

        it('should render component with type scatter and scatterChart.', () => {
            renderComponent({
                type: 'scatter',
                scatterChart: {
                    data: mockData,
                    responsive: true,
                },
                tooltip: { countProps: {text: 'expenses' }, valueProps: { text: 'Total'} }
            });
            expect(screen.getByTestId('mock-scatter-chart')).toBeInTheDocument();
        });

        it('should render component with type scatter and  without tooltip.', () => {
            renderComponent({
                type: 'scatter',
                scatterChart: {
                    data: mockData,
                    responsive: true,
                },
            });
            expect(screen.getByTestId('mock-scatter-chart')).toBeInTheDocument();
        });
    });

    describe('ComposedChart', () => {
        const mockData = [
            { x: 100, y: 200, z: 200 },
            { x: 120, y: 100, z: 260 },
            { x: 170, y: 300, z: 400 },
            { x: 140, y: 250, z: 280 },
            { x: 150, y: 400, z: 500 },
            { x: 110, y: 280, z: 200 },
        ];
        it('should render component with type composed without composedChart.', () => {
            renderComponent({ type: 'composed' });
            expect(screen.getByTestId('mock-chart-container')).toBeInTheDocument();
            expect(screen.queryByTestId('mock-composed-chart')).not.toBeInTheDocument();
        });

        it('should render component with type composed and composedChart.', () => {
            renderComponent({
                type: 'composed',
                composedChart: {
                    data: mockData,
                    responsive: true,
                },
                tooltip: { countProps: {text: 'expenses' }, valueProps: { text: 'Total'} }
            });
            expect(screen.getByTestId('mock-composed-chart')).toBeInTheDocument();
        });

        it('should render component with type composed and  without tooltip.', () => {
            renderComponent({
                type: 'composed',
                composedChart: {
                    data: mockData,
                    responsive: true,
                },
            });
            expect(screen.getByTestId('mock-composed-chart')).toBeInTheDocument();
        });

        it('should render component with type composed and  with tooltip show false.', () => {
            renderComponent({
                type: 'composed',
                tooltip: { show: false },
                composedChart: {
                    data: mockData,
                    responsive: true,
                },
            });
            expect(screen.getByTestId('mock-composed-chart')).toBeInTheDocument();
        });

        it('should render component with type composed and  with tooltip withContent false.', () => {
            renderComponent({
                type: 'composed',
                tooltip: { withContent: false },
                composedChart: {
                    data: mockData,
                    responsive: true,
                },
            });
            expect(screen.getByTestId('mock-composed-chart')).toBeInTheDocument();
        });

        it('should render component with type composed and  with tooltip filterContent.', () => {
            renderComponent({
                type: 'composed',
                tooltip: { filterContent: {
                        label: 'dataKey',
                        value: 'a',
                        condition: '!=='
                    } },
                composedChart: {
                    data: mockData,
                    responsive: true,
                },
            });
            expect(screen.getByTestId('mock-composed-chart')).toBeInTheDocument();
        });

        it('should render component with type composed and  with legend show false.', () => {
            renderComponent({
                type: 'composed',
                legend: { show: false },
                composedChart: {
                    data: mockData,
                    responsive: true,
                },
            });
            expect(screen.getByTestId('mock-composed-chart')).toBeInTheDocument();
        });

        it('should render component with type composed and  with legend withContent false.', () => {
            renderComponent({
                type: 'composed',
                legend: { withContent: false },
                composedChart: {
                    data: mockData,
                    responsive: true,
                },
            });
            expect(screen.getByTestId('mock-composed-chart')).toBeInTheDocument();
        });

        it('should render component with type composed and  with legend filterContent.', () => {
            renderComponent({
                type: 'composed',
                legend: { filterContent: {
                        label: 'dataKey',
                        value: 'a',
                        condition: '!=='
                    } },
                composedChart: {
                    data: mockData,
                    responsive: true,
                },
            });
            expect(screen.getByTestId('mock-composed-chart')).toBeInTheDocument();
        });
    });
});

