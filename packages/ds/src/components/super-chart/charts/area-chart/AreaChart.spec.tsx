import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => ({
    AreaChart: ({ children, ...props}: any) => (<div {...props} data-testid="mock-area-chart">{children}</div>),
    CartesianGrid: (props: any) => (<div {...props} data-testid="mock-cartesian-grid"/>),
    XAxis: (props: any) => (<div {...props} data-testid="mock-xaxis"/>),
    YAxis: (props: any) => {
        if(props?.tickFormatter) {
            props.tickFormatter(1000);
        }
        return (<div {...props} data-testid="mock-yaxis"/>);
    },
    Tooltip: (props: any) => {
        if(props.content) {
            props.content({});
        }
        return (<div {...props} data-testid="mock-tooltip"></div>);
    },
    Area: (props: any) => (<div {...props}/>),
}));

jest.mock('d3-shape', () => ({
    curveCardinal: {
        tension: jest.fn(),
    }
}));

jest.mock('@repo/services', () => ({
    convertToPercent: jest.fn().mockImplementation(() => '50%'),
}))

jest.mock('./linear-gradient', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-linear-gradient"></div>),
    LinearGradient: (props: any) => (<div {...props} data-testid="mock-linear-gradient"></div>),
}));

jest.mock('../../colors');

import * as colors from '../../colors';

import AreaChart from './AreaChart';

describe('<AreaChart/>', () => {
    const areas = [
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
    ];
    const labels = [{
            key: 'uv',
            fill: '#8884d8',
            type: 'monotone',
            stroke: '#8884d8',
            dataKey: 'uv'
        }]

    const defaultProps = {
        areas,
        labels,
        tooltip: {
            show: true
        }
    }

    const renderComponent = (props: any = {}) => {
        return render(<AreaChart {...defaultProps} {...props}/>);
    }

    beforeEach(() => {
        jest.spyOn(colors, 'getRandomHarmonicPalette').mockImplementation(() => ({ color: '#000', fill: '#fff', stroke: '#aaa'}));
    })

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('mock-area-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        expect(screen.getByTestId('mock-xaxis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-yaxis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-linear-gradient')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-area-chart-area-0')).toBeInTheDocument();
    });

    it('should render component with props xAxis and yAxis.', () => {
        renderComponent({ xAxis: { dataKey: 'value', width: 100 }, yAxis: { width: 90 } });
        expect(screen.getByTestId('mock-area-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        const xAxisComponent = screen.getByTestId('mock-xaxis');
        expect(xAxisComponent).toBeInTheDocument();
        expect(xAxisComponent).toHaveAttribute('width', '100');
        const yAxisComponent = screen.getByTestId('mock-yaxis');
        expect(yAxisComponent).toBeInTheDocument();
        expect(yAxisComponent).toHaveAttribute('width', '90');
    });

    it('should render component with Percent Area Chart', () => {
        renderComponent({
            xAxis: { dataKey: 'month' },
            areas: [
                {
                    name: 'month-1',
                    month: '2015.01',
                    a: 4000,
                    b: 2400,
                    c: 2400,
                },
                {
                    name: 'month-2',
                    month: '2015.02',
                    a: 3000,
                    b: 1398,
                    c: 2210,
                },
                {
                    name: 'month-3',
                    month: '2015.03',
                    a: 2000,
                    b: 9800,
                    c: 2290,
                },
                {
                    name: 'month-4',
                    month: '2015.04',
                    a: 2780,
                    b: 3908,
                    c: 2000,
                },
                {
                    name: 'month-5',
                    month: '2015.05',
                    a: 1890,
                    b: 4800,
                    c: 2181,
                },
                {
                    name: 'month-6',
                    month: '2015.06',
                    a: 2390,
                    b: 3800,
                    c: 2500,
                },
                {
                    name: 'month-7',
                    month: '2015.07',
                    a: 3490,
                    b: 4300,
                    c: 2100,
                },
            ],
            margin: {
                top: 10,
                left: 0,
                right: 20,
                bottom: 0,
            },
            labels: [
                {
                    key: 'a',
                    type: 'monotone',
                    stackId: '1',
                    dataKey: 'a'
                },
                {
                    key: 'b',
                    fill: '#82ca9d',
                    type: 'monotone',
                    stroke: '#82ca9d',
                    stackId: '1',
                    dataKey: 'b'
                },
                {
                    key: 'c',
                    fill: '#ffc658',
                    type: 'monotone',
                    stroke: '#ffc658',
                    stackId: '1',
                    dataKey: 'c'
                }
            ],
            responsive: true,
            stackOffset: 'expand',
            withPercentFormatter: true
        });
        expect(screen.getByTestId('mock-area-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        expect(screen.getByTestId('mock-xaxis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-yaxis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-linear-gradient')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-area-chart-area-0')).toBeInTheDocument();
        expect(screen.getByTestId('ds-area-chart-area-1')).toBeInTheDocument();
        expect(screen.getByTestId('ds-area-chart-area-2')).toBeInTheDocument();
    });

    it('should render component with Linear Gradient', () => {
        renderComponent({
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
                    uv: -1000,
                    pv: 9800,
                    amt: 2290,
                },
                {
                    name: 'Page D',
                    uv: 500,
                    pv: 3908,
                    amt: 2000,
                },
                {
                    name: 'Page E',
                    uv: -2000,
                    pv: 4800,
                    amt: 2181,
                },
                {
                    name: 'Page F',
                    uv: -250,
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
                fill: 'url(#splitColor)',
                type: 'monotone',
                stroke: '#000',
                dataKey: 'uv'
            }],
            linearGradient: {
                id: 'splitColor',
                y2: '1',
                value: 'uv',
                stops: [
                    {
                        key: 'stop-green',
                        offset: '0',
                        stopColor: 'green',
                        stopOpacity: 1,
                    },
                    {
                        key: 'stop-green-custom',
                        stopColor: 'green',
                        stopOpacity: 0.1
                    },
                    {
                        key: 'stop-red-custom',
                        stopColor: 'red',
                        stopOpacity: 0.1
                    },
                    {
                        key: 'stop-red',
                        offset: '1',
                        stopColor: 'red',
                        stopOpacity: 1
                    }
                ],
            }
        });
        const linearGradient = screen.getByTestId('mock-linear-gradient');
        expect(linearGradient).toBeInTheDocument();
        expect(linearGradient).toHaveAttribute('id', 'splitColor');
    });

    it('should render component with curveCardinalTension', () => {
        renderComponent({
            areas,
            labels: [
                {
                    key: 'uv',
                    fill: '#8884d8',
                    type: 'monotone',
                    stroke: '#8884d8',
                    dataKey: 'uv',
                    fillOpacity: 0.3,
                },
                {
                    key: 'uv-cardinal',
                    fill: '#82ca9d',
                    type: 'monotone',
                    stroke: '#82ca9d',
                    dataKey: 'uv',
                    fillOpacity: 0.3,
                    curveCardinalTension: 0.2,
                },
            ],
            responsive: true,
        });
        expect(screen.getByTestId('mock-area-chart')).toBeInTheDocument();
    });
});