import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => ({
    ComposedChart: ({ children, ...props}: any) => (<div {...props} data-testid="mock-composed-chart">{children}</div>),
    CartesianGrid: (props: any) => (<div {...props} data-testid="mock-cartesian-grid"/>),
    XAxis: (props: any) => (<div {...props}/>),
    YAxis: (props: any) => (<div {...props}/>),
    Tooltip: (props: any) => {
        if(props.content) {
            props.content({});
        }
        return (<div {...props} data-testid="mock-tooltip"></div>);
    },
    Legend: (props: any) => {
        if(props.content) {
            props.content({});
        }
        return (<div {...props} data-testid="mock-legend"></div>);
    },
    Area: (props: any) => (<div {...props}/>),
    Bar: (props: any) => (<div {...props}/>),
    Scatter: (props: any) => (<div {...props}/>),
    Line: (props: any) => (<div {...props}/>),
}));

import ComposedChart from './ComposedChart';

describe('<ComposedChart/>', () => {
    const data = [
        {
            name: 'Page A',
            uv: 590,
            pv: 800,
            amt: 1400,
            cnt: 490,
        },
        {
            name: 'Page B',
            uv: 868,
            pv: 967,
            amt: 1506,
            cnt: 590,
        },
        {
            name: 'Page C',
            uv: 1397,
            pv: 1098,
            amt: 989,
            cnt: 350,
        },
        {
            name: 'Page D',
            uv: 1480,
            pv: 1200,
            amt: 1228,
            cnt: 480,
        },
        {
            name: 'Page E',
            uv: 1520,
            pv: 1108,
            amt: 1100,
            cnt: 460,
        },
        {
            name: 'Page F',
            uv: 1400,
            pv: 680,
            amt: 1700,
            cnt: 380,
        },
    ];
    const defaultProps = {
        data,
    };

    const renderComponent = (props: any = {}) => {
        return render(<ComposedChart {...defaultProps} {...props}/>)
    }

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();

        expect(screen.getByTestId('mock-composed-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        expect(screen.queryByTestId('ds-composed-chart-x-axis-0')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ds-composed-chart-y-axis-0')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-tooltip')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-legend')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ds-composed-chart-area-0')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ds-composed-chart-bar-0')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ds-composed-chart-scatter-0')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ds-composed-chart-line-0')).not.toBeInTheDocument();
    });

    it('should render component with props xAxis and yAxis.', () => {
        renderComponent({
            xAxis: [{
                key: 'x-axis',
                label:{ value: 'Pages', position: 'insideBottomRight', offset: 0 },
                scale: 'band',
                dataKey:'name',
            }],
            yAxis: [{
                key: 'y-axis',
                width: 'auto',
                label: { value: 'Index', angle: -90, position: 'insideLeft' },
            }],
        });

        expect(screen.getByTestId('ds-composed-chart-x-axis-0')).toBeInTheDocument();
        expect(screen.getByTestId('ds-composed-chart-y-axis-0')).toBeInTheDocument();
    });

    it('should render component with props tooltip.', () => {
        renderComponent({
            tooltip: {show: true, content: () => <div>Tooltip</div>},
        });

        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
    });

    it('should render component with props legend.', () => {
        renderComponent({
            legend: {show: true, content: () => <div>Legend</div>},
        });

        expect(screen.getByTestId('mock-legend')).toBeInTheDocument();
    });

    it('should render component with props areas', () => {
        renderComponent({ areas: [{
                key: 'amt',
                fill: '#8884d8',
                type: 'monotone',
                stroke: '#8884d8',
                dataKey: 'amt',
            }]});
        expect(screen.getByTestId('ds-composed-chart-area-0')).toBeInTheDocument();
    });

    it('should render component with props bars', () => {
        renderComponent({ bars: [{
                key: 'pv',
                fill: '#413ea0',
                dataKey: 'pv',
                barSize: 20,
            }] });
        expect(screen.getByTestId('ds-composed-chart-bar-0')).toBeInTheDocument();
    });

    it('should render component with props lines', () => {
        renderComponent({ lines: [{
                key: 'uv',
                type: 'monotone',
                stroke: '#ff7300',
                dataKey: 'uv',
            }] });
        expect(screen.getByTestId('ds-composed-chart-line-0')).toBeInTheDocument();
    });

    it('should render component with props scatters', () => {
        renderComponent({ scatters: [{
                key: 'cnt',
                fill: 'red',
                dataKey: 'cnt',
            }]  });
        expect(screen.getByTestId('ds-composed-chart-scatter-0')).toBeInTheDocument();
    });

})