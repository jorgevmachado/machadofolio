import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => ({
    RadialBarChart: ({ children, ...props}: any) => (<div {...props} data-testid="mock-radial-bar-chart" >{children}</div>),
    RadialBar: (props: any) => (<div {...props} />),
    Tooltip: (props: any) => {
        if(props.content) {
            props.content({});
        }
        return (<div {...props} data-testid="mock-tooltip"></div>);
    },
    Legend: (props: any) => (<div {...props} data-testid="mock-legend"/>),
}));

jest.mock('../../colors');

import * as colors from '../../colors';

import RadialChart from './RadialChart';

import type { RadialChartProps } from './types';

describe('<RadialChart/>', () => {

    const data = [
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
    ];

    const defaultProps: RadialChartProps = {
        data,
        labels: [{
            key: 'uv',
            fill: '#fff',
            dataKey: 'uv',
            position: 'insideStart',
            background: true
        }],
    };

    const renderComponent = (props: any = {}) => {
        return render(<RadialChart {...defaultProps} {...props}/>)
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
        expect(screen.getByTestId('mock-radial-bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.getByTestId('ds-radial-chart-bar-0')).toBeInTheDocument();
    });

    it('should render component without tooltip.', () => {
        renderComponent({ withTooltip: false });
        expect(screen.getByTestId('mock-radial-bar-chart')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-tooltip')).not.toBeInTheDocument();
        expect(screen.getByTestId('ds-radial-chart-bar-0')).toBeInTheDocument();
    });

    it('should render component with legend props.', () => {
        renderComponent({
            legend: {
                layout: 'vertical',
                iconSize: 8,
                verticalAlign:  'middle',
            }
        });
        expect(screen.getByTestId('mock-radial-bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-legend')).toBeInTheDocument();
    });

    it('should render component with data and label default.', () => {
        const dataWithOut = data.map((item) => ({
            name: item.name,
            uv: item.uv,
            pv: item.pv,
        }));
        const labelsWithOut = defaultProps.labels?.map((item) => ({
            key: item.key,
            dataKey: item.dataKey,
        }))
        renderComponent({ data: dataWithOut, labels: labelsWithOut });
        expect(screen.getByTestId('mock-radial-bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('ds-radial-chart-bar-0')).toBeInTheDocument();
    });
});