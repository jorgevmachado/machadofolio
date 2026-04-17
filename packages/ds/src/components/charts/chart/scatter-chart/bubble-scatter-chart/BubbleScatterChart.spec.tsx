import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => ({
    Scatter: (props: any) => (<div {...props} />),
    ScatterChart: ({ children, ...props}: any) => (<div {...props}>{children}</div>),
    Tooltip: (props: any) => {
        if(props.content) {
            props.content({});
        }
        return (<div {...props}/>);
    },
    XAxis: (props: any) => (<div {...props}/>),
    YAxis: (props: any) => (<div {...props} />),
    ZAxis: (props: any) => (<div {...props} />),
}));

import BubbleScatterChart from './BubbleScatterChart';

describe('<BubbleScatterChart/>', () => {

    const mockData1 = [
        { hour: '12a', index: 1, value: 170 },
        { hour: '1a', index: 1, value: 180 },
        { hour: '2a', index: 1, value: 150 },
        { hour: '3a', index: 1, value: 120 },
        { hour: '4a', index: 1, value: 200 },
        { hour: '5a', index: 1, value: 300 },
        { hour: '6a', index: 1, value: 400 },
        { hour: '7a', index: 1, value: 200 },
        { hour: '8a', index: 1, value: 100 },
        { hour: '9a', index: 1, value: 150 },
        { hour: '10a', index: 1, value: 160 },
        { hour: '11a', index: 1, value: 170 },
        { hour: '12a', index: 1, value: 180 },
        { hour: '1p', index: 1, value: 144 },
        { hour: '2p', index: 1, value: 166 },
        { hour: '3p', index: 1, value: 145 },
        { hour: '4p', index: 1, value: 150 },
        { hour: '5p', index: 1, value: 170 },
        { hour: '6p', index: 1, value: 180 },
        { hour: '7p', index: 1, value: 165 },
        { hour: '8p', index: 1, value: 130 },
        { hour: '9p', index: 1, value: 140 },
        { hour: '10p', index: 1, value: 170 },
        { hour: '11p', index: 1, value: 180 },
    ];

    const mockData2 = [
        { hour: '12a', index: 1, value: 160 },
        { hour: '1a', index: 1, value: 180 },
        { hour: '2a', index: 1, value: 150 },
        { hour: '3a', index: 1, value: 120 },
        { hour: '4a', index: 1, value: 200 },
        { hour: '5a', index: 1, value: 300 },
        { hour: '6a', index: 1, value: 100 },
        { hour: '7a', index: 1, value: 200 },
        { hour: '8a', index: 1, value: 100 },
        { hour: '9a', index: 1, value: 150 },
        { hour: '10a', index: 1, value: 160 },
        { hour: '11a', index: 1, value: 160 },
        { hour: '12a', index: 1, value: 180 },
        { hour: '1p', index: 1, value: 144 },
        { hour: '2p', index: 1, value: 166 },
        { hour: '3p', index: 1, value: 145 },
        { hour: '4p', index: 1, value: 150 },
        { hour: '5p', index: 1, value: 160 },
        { hour: '6p', index: 1, value: 180 },
        { hour: '7p', index: 1, value: 165 },
        { hour: '8p', index: 1, value: 130 },
        { hour: '9p', index: 1, value: 140 },
        { hour: '10p', index: 1, value: 160 },
        { hour: '11p', index: 1, value: 180 },
    ];

    const mockData  = [
        {
            key: 'sunday',
            fill: '#8884d8',
            name: 'Sunday',
            data: mockData1,
        },
        {
            key: 'monday',
            fill: '#8884d8',
            data: mockData2,
            name: 'Monday',
        },
        {
            key: 'tuesday',
            fill: '#8884d8',
            data: mockData1,
            name: 'Tuesday',
        },
        {
            key: 'wednesday',
            fill: '#8884d8',
            data: mockData2,
            name: 'Wednesday',
        },
        {
            key: 'thursday',
            fill: '#8884d8',
            data: mockData1,
            name: 'Thursday',
        },
        {
            key: 'friday',
            fill: '#8884d8',
            data: mockData2,
            name: 'Friday',
        },
        {
            key: 'Saturday',
            fill: '#8884d8',
            data: mockData1,
            name: 'saturday',
            showTicks: true
        },
    ];
    const mockRange = [16, 225];
    const mockStyle = { width: '100%', minWidth: '700px', maxWidth: '900px', height: '60px' };
    const mockMargin = { top: 10, right: 0, bottom: 0, left: 0 };

    const mockAxis = {
        x:  {
            tick: { fontSize: 0 },
            type: "category",
            name: "hour",
            dataKey: "hour",
            interval: 0,
            tickLine: { transform: 'translate(0, -6)' },
        },
        y:  {
            tick: false,
            name: 'sunday',
            type: 'number',
            width: 80,
            height: 10,
            dataKey: 'index',
            tickLine: false,
            axisLine: false,
            label: { position: 'insideRight' },
        },
        z:  {
            type: 'number',
            dataKey: 'value',
        }
    }
    const mockDomain = [ 0,
        Math.max(
            Math.max.apply(
                null,
                mockData1.map(entry => entry.value),
            ),
            Math.max.apply(
                null,
                mockData2.map(entry => entry.value),
            ),
        )];
    const mockBubbleStyle = { width: '100%', maxWidth: '900px' }

    const defaultProps = {
        data: mockData.map((item) => ({
            key: item.key,
            name: item.name,
            data: item.data,
        })),
        axis: mockAxis,
        style: mockStyle,
        tooltip: { show: true },

    }

    const renderComponent = (props: any = {}) => {
        return render(<BubbleScatterChart {...defaultProps} {...props}/>);
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.getByTestId('ds-bubble-scatter-chart')).toBeInTheDocument();
        mockData.forEach((_, index) => {
            expect(screen.getByTestId(`ds-bubble-scatter-chart-${index}`)).toBeInTheDocument();
            expect(screen.getByTestId(`ds-bubble-scatter-chart-x-axis-${index}`)).toBeInTheDocument();
            expect(screen.getByTestId(`ds-bubble-scatter-chart-y-axis-${index}`)).toBeInTheDocument();
            expect(screen.getByTestId(`ds-bubble-scatter-chart-z-axis-${index}`)).toBeInTheDocument();
            expect(screen.getByTestId(`ds-bubble-scatter-chart-scatter-${index}`)).toBeInTheDocument();
            expect(screen.getByTestId(`ds-bubble-scatter-chart-tooltip-${index}`)).toBeInTheDocument();
        })
    });

    it('should render component with all props.', () => {
        renderComponent({
            data: mockData,
            axis: mockAxis,
            range: mockRange,
            style: mockStyle,
            margin: mockMargin,
            domain: mockDomain,
            bubbleStyle: mockBubbleStyle
        });
        const component =  screen.getByTestId('ds-bubble-scatter-chart');
        expect(component).toBeInTheDocument();
        expect(component).toHaveStyle(mockBubbleStyle);

        const firstBubbleScatterChart = screen.getByTestId(`ds-bubble-scatter-chart-0`);
        expect(firstBubbleScatterChart).toBeInTheDocument();
        expect(firstBubbleScatterChart).toHaveStyle(mockStyle);

        const firstBubbleScatterChartScatter = screen.getByTestId(`ds-bubble-scatter-chart-scatter-0`);
        expect(firstBubbleScatterChartScatter).toBeInTheDocument();
        expect(firstBubbleScatterChartScatter).toHaveAttribute('fill', '#8884d8');
    });
});