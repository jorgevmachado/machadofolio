import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => ({
    Radar: (props: any) => (<div {...props}/>),
    Tooltip: (props: any) => {
        if(props.content) {
            props.content({});
        }
        return (<div {...props} data-testid="mock-tooltip"></div>);
    },
    RadarChart: ({ children, ...props}: any) => (<div {...props} data-testid="mock-radar-chart">{children}</div>),
    PolarGrid: (props: any) => (<div {...props} data-testid="mock-polar-grid"/>),
    PolarAngleAxis: (props: any) => (<div {...props} data-testid="mock-polar-angle-axis"/>),
    PolarRadiusAxis: (props: any) => (<div {...props} data-testid="mock-polar-radius-axis"/>),
    Legend: (props: any) => (<div {...props} data-testid="mock-legend"/>),
}));

jest.mock('../../colors');

import * as colors from '../../colors';


import RadarChart from './RadarChart';
import { RadarChartProps } from './types';

describe('<RadarChart/>', () => {

    const data = [
        {
            A: 120,
            B: 110,
            subject: 'Math',
            fullMark: 150,
        },
        {
            A: 98,
            B: 130,
            subject: 'Chinese',
            fullMark: 150,
        },
        {
            A: 86,
            B: 130,
            subject: 'English',
            fullMark: 150,
        },
        {
            A: 99,
            B: 100,
            subject: 'Geography',
            fullMark: 150,
        },
        {
            A: 85,
            B: 90,
            subject: 'Physics',
            fullMark: 150,
        },
        {
            A: 65,
            B: 85,
            subject: 'History',
            fullMark: 150,
        },
    ];
    const labels = [{
        key: 'mike',
        fill: '#8884d8',
        name: 'Mike',
        stroke: '#8884d8',
        dataKey: 'A',
        fillOpacity: 0.6,
    }];

    const defaultProps: RadarChartProps = {
        value: 'subject',
        data,
        labels,
        tooltip: {
            withDefaultTooltip: true
        },
    };

    const renderComponent = (props: any = {}) => {
        return render(<RadarChart {...defaultProps} {...props}/>)
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
        expect(screen.getByTestId('mock-radar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('mock-polar-grid')).toBeInTheDocument();
        expect(screen.getByTestId('mock-polar-angle-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-polar-radius-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        const radarArea = screen.getByTestId('ds-radar-chart-area-0');
        expect(radarArea).toBeInTheDocument();
        expect(radarArea).toHaveAttribute('fill', '#8884d8');
        expect(radarArea).toHaveAttribute('stroke', '#8884d8');
    });

    it('should render component without label fill, stroke and fillOpacity', () => {
        const mockLabelsWithoutFillStrokeAndFillOpacity = labels.map((item) => ({
            key: item.key,
            name: item.name,
            dataKey: item.dataKey,
        }))
        renderComponent({ labels: mockLabelsWithoutFillStrokeAndFillOpacity });

        const radarArea = screen.getByTestId('ds-radar-chart-area-0');
        expect(radarArea).toBeInTheDocument();
        expect(radarArea).toHaveAttribute('fill', '#fff');
        expect(radarArea).toHaveAttribute('stroke', '#aaa');
    });

    it('should render component with polarAngleAxis and polarRadiusAxis', () => {
        renderComponent({
            legend: { show: true },
            polarAngleAxis: { dataKey: 'subject' },
            polarRadiusAxis: { angle: 30, domain: [0, 150] },
        });
        expect(screen.getByTestId('mock-polar-angle-axis')).toBeInTheDocument();
        const polarRadiusAxis = screen.getByTestId('mock-polar-radius-axis');
        expect(polarRadiusAxis).toBeInTheDocument();
        expect(polarRadiusAxis).toHaveAttribute('angle', '30');

        expect(screen.getByTestId('mock-legend')).toBeInTheDocument();
    });
});