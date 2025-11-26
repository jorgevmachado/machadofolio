import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => ({
    PieChart: (props: any) => (<div {...props} data-testid="mock-pie-chart"></div>),
    Pie: (props: any) => {
        return (
            <div {...props}>
                {props.activeShape ? props.activeShape({}) : props.children}
            </div>
        );
    },
    Legend: (props: any) => (<div {...props} data-testid="mock-legend"></div>),
    Tooltip: (props: any) => {
        if(props.content) {
            props.content({});
        }
        return (<div {...props} data-testid="mock-tooltip"></div>);
    },
    Cell: (props: any) => (<div {...props} />),
}));

jest.mock('./active-shape', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-active-shape"></div>),
    ActiveShape: (props: any) => (<div {...props} data-testid="mock-active-shape"></div>),
}));

jest.mock('./customize-label', () => ({
        __esModule: true,
        default: (props: any) => (<div {...props} data-testid="mock-customize-label"></div>),
        CustomizeLabel: (props: any) => (<div {...props} data-testid="mock-customize-label"></div>),
}));

jest.mock('./pie-needle', () => ({
        __esModule: true,
        default: (props: any) => (<div {...props} data-testid="mock-pie-needle"></div>),
        PieNeedle: (props: any) => (<div {...props} data-testid="mock-pie-needle"></div>),
}));

import PieChart from './PieChart';

jest.mock('../../colors');

import * as colors from '../../colors';

describe('<PieChart/>', () => {

    const mockPies = [
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

    const defaultProps = {
        data: mockPies,
        tooltip: {
            show: true,
        }
    }

    const renderComponent = (props: any = {}) => {
        return render(<PieChart {...defaultProps} {...props}/>);
    }

    beforeEach(() => {
        jest.spyOn(colors, 'mapListColors').mockImplementation((list) => {
            return list.map((item) => ({
                ...item,
                color: item?.color ?? '#000',
                fill: item?.fill ?? '#fff',
                stroke: item?.stroke ?? '#aaa'
            }));
        });
    })

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
    });

    it('should render straight angle pie chart', () => {
        renderComponent({
            data: [
                {
                    cx: '50%',
                    cy: '50%',
                    key: 'straight-angle',
                    fill: '#8884d8',
                    data: [
                        { name: 'Group A', value: 400 },
                        { name: 'Group B', value: 300 },
                        { name: 'Group C', value: 300 },
                        { name: 'Group D', value: 200 },
                    ],
                    label: false,
                    dataKey: 'value',
                    innerRadius: '60%',
                    outerRadius: '80%',
                    isAnimationActive: true,
                },
                {
                    cx: '50%',
                    cy: '100%',
                    key: 'straight-angle-2',
                    fill: '#8884d8',
                    data: [
                        { name: 'Group E', value: 500 },
                        { name: 'Group F', value: 400 },
                        { name: 'Group G', value: 400 },
                        { name: 'Group H', value: 300 },
                    ],
                    label: true,
                    dataKey: 'value',
                    endAngle: 0,
                    startAngle: 180,
                    outerRadius: '120%',
                    isAnimationActive: true,
                }
            ],
            style: {
                aspectRatio: 2,
            },
            margin: {
                top: 50,
                right: 120,
                bottom: 50,
                left: 120,
            },
            withTooltip: false,
            withoutContentTooltip: true,
            withDefaultActiveShape: true
        });

        expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
        expect(screen.getByTestId('ds-pie-chart-pie-straight-angle')).toBeInTheDocument();
        expect(screen.getByTestId('mock-active-shape')).toBeInTheDocument();
    });

    it('Pie Chart With Customized Label', () => {
        renderComponent({
            data: [
                {
                    key: 'customized-label',
                    fill: '#8884d8',
                    data: [
                        { fill: '#0088FE', name: 'Group A', value: 400 },
                        { fill: '#00C49F', name: 'Group B', value: 300 },
                        { fill: '#FFBB28', name: 'Group C', value: 300 },
                        { fill: '#FF8042', name: 'Group D', value: 200 },
                    ],
                    dataKey: 'value',
                    labelLine: false,
                    isAnimationActive: true,
                },
                {
                    cx: '50%',
                    cy: '100%',
                    key: 'straight-angle-2',
                    fill: '#8884d8',
                    data: [
                        { name: 'Group E', value: 500 },
                        { name: 'Group F', value: 400 },
                        { name: 'Group G', value: 400 },
                        { name: 'Group H', value: 300 },
                    ],
                    label: true,
                    dataKey: 'value',
                    endAngle: 0,
                    startAngle: 180,
                    outerRadius: '120%',
                    isAnimationActive: true,
                }
            ],
            withoutContentTooltip: true,
            withDefaultCustomLabel: true
        });

        expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
        expect(screen.getByTestId('ds-pie-chart-pie-customized-label')).toBeInTheDocument();
        expect(screen.getByTestId('ds-pie-chart-cell-0')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
    });

    it('Pie Chart With Customized Label without fill in data', () => {
        renderComponent({
            data: [
                {
                    key: 'customized-label',
                    fill: '#8884d8',
                    data: [
                        { name: 'Group A', value: 400 },
                        { name: 'Group B', value: 300 },
                        { name: 'Group C', value: 300 },
                        { name: 'Group D', value: 200 },
                    ],
                    dataKey: 'value',
                    labelLine: false,
                    isAnimationActive: true,
                },
                {
                    cx: '50%',
                    cy: '100%',
                    key: 'straight-angle-2',
                    fill: '#8884d8',
                    data: [
                        { name: 'Group E', value: 500 },
                        { name: 'Group F', value: 400 },
                        { name: 'Group G', value: 400 },
                        { name: 'Group H', value: 300 },
                    ],
                    label: true,
                    dataKey: 'value',
                    endAngle: 0,
                    startAngle: 180,
                    outerRadius: '120%',
                    isAnimationActive: true,
                }
            ],
            withoutContentTooltip: true,
            withDefaultCustomLabel: true
        });

        expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
        expect(screen.getByTestId('ds-pie-chart-pie-customized-label')).toBeInTheDocument();
        const componentCell = screen.getByTestId('ds-pie-chart-cell-0');
        expect(componentCell).toBeInTheDocument();
        expect(componentCell).toHaveAttribute('fill', '#fff');
    });

    it('Pie Chart With Needle', () => {
        renderComponent({
            data: [
                {
                    key: 'pie_chart_with_needle',
                    cx: 100,
                    cy: 100,
                    fill: '#8884d8',
                    data: [
                        { fill: '#ff0000', name: 'A', value: 80  },
                        { fill: '#00ff00', name: 'B', value: 45 },
                        { fill: '#FFBB28', name: 'C', value: 25 },
                    ],
                    value: 50,
                    color: '#d0d000',
                    dataKey: 'value',
                    endAngle:  0,
                    startAngle: 180,
                    innerRadius: 50,
                    outerRadius: 100,
                    isAnimationActive: true,
                }
            ],
            style: { margin: '0 auto', width: 210, height: 120 },
            legend: {
                show: true
            },
            withNeedle: true,
            withLegends: true,
            withoutContentTooltip: true,
        });
        expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
        expect(screen.getByTestId('ds-pie-chart-pie-pie_chart_with_needle')).toBeInTheDocument();
        expect(screen.getByTestId('mock-pie-needle')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('mock-legend')).toBeInTheDocument();
    });
});