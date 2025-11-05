import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react';

jest.mock('recharts', () => ({
    Scatter: ({ children, ...props}: any) => (<div {...props}>{children}</div>),
    ScatterChart: ({ children, ...props}: any) => (<div {...props} data-testid="mock-scatter-chart">{children}</div>),
    Tooltip: (props: any) => {
        if(props.content) {
            props.content({});
        }
        return (<div {...props} data-testid="mock-tooltip"></div>);
    },
    XAxis: (props: any) => (<div {...props}/>),
    YAxis: (props: any) => (<div {...props} />),
    ZAxis: (props: any) => (<div {...props} />),
    CartesianGrid: (props: any) => (<div {...props} data-testid="mock-cartesian-grid"/>),
    Legend: (props: any) => (<div {...props} data-testid="mock-legend"/>),
    LabelList: (props: any) => (<div {...props} />),
    Cell: (props: any) => (<div {...props} />),
}));

jest.mock('./bubble-scatter-chart', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-bubble-scatter-chart" />),
    BubbleScatterChart: (props: any) => (<div {...props} data-testid="mock-bubble-scatter-chart" />),
}));

jest.mock('../../colors');

import * as colors from '../../colors';

import ScatterChart from './ScatterChart';

describe('<ScatterChart/>', () => {
    const mockData = [
        {
            key: 'school-a',
            fill: '#8884d8',
            data: [
                { x: 100, y: 200, z: 200, fill: '#8884d8' },
                { x: 120, y: 100, z: 260 },
                { x: 170, y: 300, z: 400 },
                { x: 140, y: 250, z: 280 },
                { x: 150, y: 400, z: 500 },
                { x: 110, y: 280, z: 200 },
            ],
            name: 'A school',
        }
    ];

    const defaultProps = {
        data: mockData,
        withLegend: false,
        withTooltip: false,
    }

    const renderComponent = (props: any = {}) => {
        return render(<ScatterChart {...defaultProps} {...props}/>);
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
        expect(screen.getByTestId('mock-scatter-chart')).toBeInTheDocument();

        const xAxisComponent = screen.getByTestId(`ds-scatter-chart-x-axis-0`);
        expect(xAxisComponent).toBeInTheDocument();
        expect(xAxisComponent).toHaveAttribute('type', 'number');
        expect(xAxisComponent).toHaveAttribute('unit', 'cm');

        const yAxisComponent = screen.getByTestId(`ds-scatter-chart-y-axis-0`);
        expect(yAxisComponent).toBeInTheDocument();
        expect(yAxisComponent).toHaveAttribute('type', 'number');
        expect(yAxisComponent).toHaveAttribute('unit', 'kg');

        expect(screen.queryByTestId('mock-tooltip')).not.toBeInTheDocument();
        expect(screen.queryByTestId('mock-legend')).not.toBeInTheDocument();

        const scatterComponent = screen.getByTestId(`ds-scatter-chart-scatter-0`);
        expect(scatterComponent).toBeInTheDocument();
        expect(scatterComponent).toHaveAttribute('fill', '#8884d8');
        expect(scatterComponent).toHaveAttribute('name', 'A school');

        expect(screen.queryByTestId(`ds-scatter-chart-scatter-label-list-0`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`ds-scatter-chart-scatter-0-cell-0`)).not.toBeInTheDocument();
    });

    it('should render component with tooltip.', () => {
        const mockTooltipContent = jest.fn();
        renderComponent({ withTooltip: true, tooltip: { withContent: true, content: mockTooltipContent } });

        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(mockTooltipContent).toHaveBeenCalled();
    });

    it('should render component with tooltip props.', () => {
        renderComponent({ withTooltip: true, tooltip: { withContent: false } });

        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
    });

    it('should render component with legend.', () => {
        renderComponent({ withLegend: true });

        expect(screen.getByTestId('mock-legend')).toBeInTheDocument();
    });

    it('should render component with type bubble.', () => {
        renderComponent({ type: 'bubble' });

        expect(screen.getByTestId('mock-bubble-scatter-chart')).toBeInTheDocument();
    });

    it('should render component with label list.', () => {
        renderComponent({
            data: mockData.map((item) => ({
                ...item,
                labelList: {
                    fill: 'black',
                    dataKey: 'x'
                }
            })),
        });
        const labelListComponent = screen.getByTestId(`ds-scatter-chart-scatter-label-list-0`);
        expect(labelListComponent).toBeInTheDocument();
        expect(labelListComponent).toHaveAttribute('fill', 'black');
    });

    it('should render component with cell.', () => {
        renderComponent({
            data: mockData.map((item) => ({
                ...item,
                withCell: true,
            })),
        });
        const labelList0Component = screen.getByTestId(`ds-scatter-chart-scatter-${0}-cell-${0}`);
        expect(labelList0Component).toBeInTheDocument();
        expect(labelList0Component).toHaveAttribute('fill', '#8884d8');

        const labelList1Component = screen.getByTestId(`ds-scatter-chart-scatter-${0}-cell-${1}`);
        expect(labelList1Component).toBeInTheDocument();
        expect(labelList1Component).toHaveAttribute('fill', '#fff');
    });
})