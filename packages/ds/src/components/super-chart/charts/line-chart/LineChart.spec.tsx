import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

let mouseDownCalled = false;
let mouseMoveCalled = false;
let mouseUpCalled = false;

jest.mock('recharts', () => ({
    LineChart: ({ children, ...props }: any) => (
      <div
        {...props}
        data-testid="mock-line-chart-component"
        onMouseDown={() => {
          if (!mouseDownCalled && props.onMouseDown) {
            mouseDownCalled = true;
            props.onMouseDown({ activeLabel: 1 });
          }
        }}
        onMouseMove={() => {
          if (!mouseMoveCalled && props.onMouseMove) {
            mouseMoveCalled = true;
            props.onMouseMove({ activeLabel: 2 });
          }
        }}
        onMouseUp={() => {
          if (!mouseUpCalled && props.onMouseUp) {
            mouseUpCalled = true;
            props.onMouseUp({ activeLabel: 3 });
          }
        }}
      >
        {children}
      </div>
    ),
    CartesianGrid: (props: any) => (<div {...props} data-testid="mock-cartesian-grid"/>),
    ReferenceLine: (props: any) => (<div {...props}/>),
    XAxis: (props: any) => {
        let tickEl = null;
        if (props.tickFormatter) {
            props.tickFormatter(1234);
        }
        if (typeof props.tick === 'function') {
            tickEl = props.tick({ x: 0, y: 0, payload: { value: 'test' }, customAxisTick: props.customAxisTick });
        }
        if(typeof props.domain === 'function') {
            props.domain([0, 1000]);
        }
        return <div {...props} data-testid="mock-x-axis">{tickEl}</div>;
    },
    YAxis: (props: any) => {
        let tickEl = null;

        if (props.tickFormatter) {
            props.tickFormatter(5678);
        }
        if(typeof props.domain === 'function') {
            props.domain([0, 1000]);
        }
        if (typeof props.tick === 'function') {
            tickEl = props.tick({ x: 0, y: 0, payload: { value: 'test' }, customAxisTick: props.customAxisTick });
        }
        return <div {...props} data-testid="mock-y-axis">{tickEl}</div>;
    },
    Tooltip: (props: any) => (<div {...props} data-testid="mock-tooltip"/>),
    Legend: (props: any) => (<div {...props} data-testid="mock-legend"/>),
    Line: (props: any) => {
        let dotEl = null
        let labelEL = null
        if (typeof props.dot === 'function') {
            dotEl = props.dot({cx: 60, cy: 303.68, value: 2400});
        }
        if(typeof props.label === 'function') {
            labelEL =  props.label({x: 60, y: 303.68, value: 2400});
        }
        return (<div {...props} data-testid="mock-line">
            <>
                {dotEl}
                {labelEL}
            </>
        </div>)
    },
    ReferenceArea: (props: any) => (<div {...props} data-testid="mock-reference-area"/>),
}));

jest.mock('../../../button', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props}/>),
    Button: (props: any) => (<div {...props} />)
}));

jest.mock('../../colors');
jest.mock('./domain');

import * as colors from '../../colors';
import * as domain from './domain';


jest.mock('./customized-dot', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-customized-dot" />),
    CustomizedDot: (props: any) => (<div {...props} data-testid="mock-customized-dot" />)
}));

jest.mock('./customized-label', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-customized-label" />),
    CustomizedLabel: (props: any) => (<div {...props} data-testid="mock-customized-label" />)
}));

jest.mock('./customized-axis-tick', () => ({
    __esModule: true,
    default: (props: any) => (<div {...props} data-testid="mock-customized-axis-tick" />),
    CustomizedAxisTick: (props: any) => (<div {...props} data-testid="mock-customized-axis-tick" />)
}));

import LineChart from './LineChart';

describe('<LineChart/>', () => {

    const mockData = [
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

    const mockLabels = [
            {
                key: 'pv',
                stroke: '#8884d8',
                dataKey: 'pv',
            },
            {
                key: 'uv',
                stroke: '#82ca9d',
                dataKey: 'uv',
            }
    ];

    const defaultProps = {
        axis: {
          xList: [{ key: 'x-axis-0', dataKey: 'name'}],
          yList: [{ key: 'y-axis-0', width: 'auto'}],
        },
        tooltip: {
            withDefaultTooltip: true,
        }
    }

    const renderComponent = (props: any = {}) => {
        return render(<LineChart {...defaultProps} {...props}/>)
    }

    beforeEach(() => {
        mouseDownCalled = false;
        mouseMoveCalled = false;
        mouseUpCalled = false;
        jest.spyOn(colors, 'getRandomHarmonicPalette').mockImplementation(() => ({ color: '#000', fill: '#fff', stroke: '#aaa'}));
        jest.spyOn(domain, 'buildDomain').mockImplementation(() => ([ 0, 1000 ]));
        jest.spyOn(domain, 'updateDomainItem').mockImplementation(({ prev }) => ({
            ...prev,
            refAreaLeft: 1,
            refAreaRight: 2,
        }));
    })

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should render component with props default.', () => {
        renderComponent();
        expect(screen.queryByTestId('ds-line-chart-button-zoom-out')).not.toBeInTheDocument();
        expect(screen.getByTestId('mock-line-chart-component')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-reference-line')).not.toBeInTheDocument();
        expect(screen.getByTestId('mock-x-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-y-axis')).toBeInTheDocument();
        expect(screen.getByTestId('mock-tooltip')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-legend')).not.toBeInTheDocument();
        expect(screen.queryByTestId('ds-line-chart-line-0')).not.toBeInTheDocument();
    });

    it('should render component with props label withCustomColor equal false', () => {
        renderComponent({
            labels: mockLabels.map((item) => ({
                ...item,
                withCustomColor: false
            }))
        });
        const lineChart = screen.getAllByTestId('mock-line')
        lineChart.forEach((line) => {
            expect(line).toBeInTheDocument();
            expect(line).not.toHaveAttribute('stroke', '#fff');
        })

    })

    it('should render component with props xAxis and yAxis and with custom domain.', () => {
        renderComponent({
            data: mockData,
            axis: {
                xList: [{
                    type: 'number',
                    customDomain: ['left', 'right'],
                    customAxisTick: { fill: '#666'},
                }],
                yList: [{
                    type: 'category',
                    width: 'auto',
                    dataKey: 'name',
                    customDomain: ['bottom', 'top'],
                    customAxisTick: { fill: '#000'},
                }],
            },
            labels: mockLabels,
        });

        expect(screen.getByTestId('mock-line-chart-component')).toBeInTheDocument();
        expect(screen.getByTestId('mock-cartesian-grid')).toBeInTheDocument();

        const mockXAxisComponent = screen.getByTestId('mock-x-axis');
        expect(mockXAxisComponent).toBeInTheDocument();
        expect(mockXAxisComponent).toHaveAttribute('type', 'number');

        const mockYAxisComponent = screen.getByTestId('mock-y-axis');
        expect(mockYAxisComponent).toBeInTheDocument();
        expect(mockYAxisComponent).toHaveAttribute('type', 'category');

        const ticks = screen.getAllByTestId('mock-customized-axis-tick');
        expect(ticks.length).toBeGreaterThan(0);
        ticks.forEach(tick => expect(tick).toBeInTheDocument());
    });

    it('should render component with legend.', () => {
        renderComponent({ legend: { show: true } });
        expect(screen.getByTestId('mock-legend')).toBeInTheDocument();
    });

    it('should render component with customDot in labels', () => {
        renderComponent({
            labels: mockLabels.map((item) => ({
                ...item,
                customDot: { maxValue: 2500 }
            }))
        });
        expect(screen.getByTestId('mock-line-chart-component')).toBeInTheDocument();

        const dots = screen.getAllByTestId('mock-customized-dot');
        expect(dots.length).toBeGreaterThan(0);
        dots.forEach(dot => expect(dot).toBeInTheDocument());
    });

    it('should render component with customLabel in labels', () => {
        renderComponent({
            labels: mockLabels.map((item) => ({
                ...item,
                customLabel: { dy: -4 }
            }))
        });
        expect(screen.getByTestId('mock-line-chart-component')).toBeInTheDocument();

        const labels = screen.getAllByTestId('mock-customized-label');
        expect(labels.length).toBeGreaterThan(0);
        labels.forEach(label => expect(label).toBeInTheDocument());
    });

    it('should render component with referenceLines', () => {
        const lineChartNegativeValuesWithReferenceLinesData = [
            {
                x: -50,
                y: -50,
            },
            {
                x: 0,
                y: 0,
            },
            {
                x: 50,
                y: 50,
            },
            {
                x: 100,
                y: 100,
            },
            {
                x: 150,
                y: 150,
            },
            {
                x: 200,
                y: 200,
            },
            {
                x: 250,
                y: 250,
            },
            {
                x: 350,
                y: 350,
            },
            {
                x: 400,
                y: 400,
            },
            {
                x: 450,
                y: 450,
            },
            {
                x: 500,
                y: 500,
            },
        ];
        const minX = Math.min(...lineChartNegativeValuesWithReferenceLinesData.map(d => d.x));
        const minY = Math.min(...lineChartNegativeValuesWithReferenceLinesData.map(d => d.y));
        renderComponent({
            style: { width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 },
            axis: {
                xList: [{
                    dataKey:"x",
                    domain:['auto', 'auto'],
                    interval:0,
                    type:"number",
                    label:{ key: 'xAxisLabel', value: 'x', position: 'bottom' },
                    allowDataOverflow: true,
                    strokeWidth: minY < 0 ? 0 : 1,
                }],
                yList: [{
                    dataKey: 'y',
                    domain: ['auto', 'auto'],
                    type: 'number',
                    interval: 0,
                    label: {
                        value: 'y',
                        style: { textAnchor: 'middle' },
                        angle: -90,
                        position: 'left',
                        offset: 0,
                    },
                    allowDataOverflow: true,
                    strokeWidth: minX < 0 ? 0 : 1,
                    width: 'auto',
                }]
            },
            labels: [{
                key: 'y',
                strokeWidth: 2,
                data: lineChartNegativeValuesWithReferenceLinesData,
                dot: false,
                type: 'monotone',
                dataKey: 'y',
                tooltipType: 'none'
            }],
            referenceLines: [
                {
                    y: 0,
                    show: true,
                    strokeWidth: 1.5,
                    strokeOpacity: 0.65
                },
                {
                    x: 0,
                    show: false,
                    stroke: 'gray',
                    strokeWidth: 1.5,
                    strokeOpacity: 0.65
                }
            ]
        });

        expect(screen.getByTestId('ds-line-chart-reference-line-0')).toBeInTheDocument();
        expect(screen.queryByTestId('ds-line-chart-reference-line-1')).not.toBeInTheDocument();
    });

    describe('component with zoom', () => {
        const mockData =[
            { name: 1, cost: 4.11, impression: 100 },
            { name: 2, cost: 2.39, impression: 120 },
            { name: 3, cost: 1.37, impression: 150 },
            { name: 4, cost: 1.16, impression: 180 },
            { name: 5, cost: 2.29, impression: 200 },
            { name: 6, cost: 3, impression: 499 },
            { name: 7, cost: 0.53, impression: 50 },
            { name: 8, cost: 2.52, impression: 100 },
            { name: 9, cost: 1.79, impression: 200 },
            { name: 10, cost: 2.94, impression: 222 },
            { name: 11, cost: 4.3, impression: 210 },
            { name: 12, cost: 4.41, impression: 300 },
            { name: 13, cost: 2.1, impression: 50 },
            { name: 14, cost: 8, impression: 190 },
            { name: 15, cost: 0, impression: 300 },
            { name: 16, cost: 9, impression: 400 },
            { name: 17, cost: 3, impression: 200 },
            { name: 18, cost: 2, impression: 50 },
            { name: 19, cost: 3, impression: 100 },
            { name: 20, cost: 7, impression: 100 },
        ];

        const mockLabels = [
            {
                key: 'cost',
                type: 'natural',
                offset: 1,
                stroke: '#8884d8',
                dataKey: 'cost',
                yAxisId: '1',
                animationDuration: 300
            },
            {
                key: 'impression',
                type: 'natural',
                offset: 50,
                stroke: '#82ca9d',
                yAxisId: '2',
                dataKey: 'impression',
                animationDuration: 300
            }
        ];

        const mockXAxis = [{
            type: 'number',
            dataKey: 'name',
            customDomain: ['left', 'right'],
            allowDataOverflow: true,
        }];

        const mockYAxis = [
            {   type: 'number',
                width: 'auto',
                yAxisId: '1',
                customDomain: ['bottom', 'top'],
                allowDataOverflow: true,
            },
            {   type: 'number',
                width: 'auto',
                yAxisId: '2',
                orientation: 'right',
                customDomain: ['bottom2', 'top2'],
                allowDataOverflow: true,
            }
        ]

        it('should render component with zoom', async () => {
            const mockOnMouseUp = jest.fn();
            const mockOnMouseMove = jest.fn();
            const mockOnMouseDown = jest.fn();
            renderComponent({
                data: mockData,
                axis: {
                    xList: mockXAxis,
                    yList: mockYAxis
                },
                labels: mockLabels,
                withZoom: true,
                onMouseUp: mockOnMouseUp,
                withLegend: true,
                onMouseMove: mockOnMouseMove,
                onMouseDown: mockOnMouseDown,
                referenceArea: {
                    yAxisId: '1',
                    strokeOpacity: 0.3
                },
                buttonZoomOut: {
                    id: 'zoom-out',
                    context: 'primary',
                    children: 'Zoom Out',
                    className: 'custom-classname'
                }
            });

            expect(screen.getByTestId('ds-line-chart-button-zoom-out')).toBeInTheDocument();

            const chart = screen.getByTestId('mock-line-chart-component');

            fireEvent.mouseDown(chart, { clientX: 100, clientY: 200 });
            expect(mockOnMouseDown).toHaveBeenCalled();

            fireEvent.mouseMove(chart, { clientX: 150, clientY: 250 });
            expect(mockOnMouseMove).toHaveBeenCalled();

            fireEvent.mouseUp(chart, { clientX: 150, clientY: 250 });
            expect(mockOnMouseUp).toHaveBeenCalled();

            await screen.findByTestId('mock-reference-area');
        });

        it('should render component without props referenceArea', async () => {
            const mockOnMouseUp = jest.fn();
            const mockOnMouseMove = jest.fn();
            const mockOnMouseDown = jest.fn();
            renderComponent({
                data: mockData,
                axis: {
                    xList: mockXAxis,
                    yList: mockYAxis
                },
                labels: mockLabels,
                withZoom: true,
                onMouseUp: mockOnMouseUp,
                withLegend: true,
                onMouseMove: mockOnMouseMove,
                onMouseDown: mockOnMouseDown,
                buttonZoomOut: {
                    id: 'zoom-out',
                    context: 'primary',
                    children: 'Zoom Out',
                    className: 'custom-classname'
                }
            });

            expect(screen.getByTestId('ds-line-chart-button-zoom-out')).toBeInTheDocument();

            const chart = screen.getByTestId('mock-line-chart-component');

            fireEvent.mouseDown(chart, { clientX: 100, clientY: 200 });
            expect(mockOnMouseDown).toHaveBeenCalled();

            fireEvent.mouseMove(chart, { clientX: 150, clientY: 250 });
            expect(mockOnMouseMove).toHaveBeenCalled();

            fireEvent.mouseUp(chart, { clientX: 150, clientY: 250 });
            expect(mockOnMouseUp).toHaveBeenCalled();

            await screen.findByTestId('mock-reference-area');
        });

        it('should click in zoomOut button', async () => {
            const mockOnMouseUp = jest.fn();
            const mockOnMouseMove = jest.fn();
            const mockOnMouseDown = jest.fn();
            renderComponent({
                data: mockData,
                axis: {
                    xList: mockXAxis,
                    yList: mockYAxis
                },
                labels: mockLabels,
                withZoom: true,
                onMouseUp: mockOnMouseUp,
                withLegend: true,
                onMouseMove: mockOnMouseMove,
                onMouseDown: mockOnMouseDown,
                buttonZoomOut: {
                    id: 'zoom-out',
                    context: 'primary',
                    children: 'Zoom Out',
                    className: 'custom-classname'
                }
            });
            const componentButtonZoomOut = screen.getByTestId('ds-line-chart-button-zoom-out');
            expect(componentButtonZoomOut).toBeInTheDocument();

            const chart = screen.getByTestId('mock-line-chart-component');

            fireEvent.mouseDown(chart, { clientX: 100, clientY: 200 });
            expect(mockOnMouseDown).toHaveBeenCalled();

            fireEvent.mouseMove(chart, { clientX: 150, clientY: 250 });
            expect(mockOnMouseMove).toHaveBeenCalled();

            fireEvent.mouseUp(chart, { clientX: 150, clientY: 250 });
            expect(mockOnMouseUp).toHaveBeenCalled();

            await screen.findByTestId('mock-reference-area');

            fireEvent.click(componentButtonZoomOut);

            const notMockReferenceArea = await screen.queryByTestId('mock-reference-area')
            expect(notMockReferenceArea).not.toBeInTheDocument();
        });

        it('should render not render component ReferenceArea', async () => {
            const mockOnMouseMove = jest.fn();
            renderComponent({
                data: mockData,
                axis: {
                    xList: mockXAxis,
                    yList: mockYAxis
                },
                labels: mockLabels,
                withZoom: true,
                withLegend: true,
                onMouseMove: mockOnMouseMove,
                buttonZoomOut: {
                    id: 'zoom-out',
                    context: 'primary',
                    children: 'Zoom Out',
                    className: 'custom-classname'
                }
            });
            const componentButtonZoomOut = screen.getByTestId('ds-line-chart-button-zoom-out');
            expect(componentButtonZoomOut).toBeInTheDocument();

            const chart = screen.getByTestId('mock-line-chart-component');

            fireEvent.mouseMove(chart, { clientX: 150, clientY: 250 });
            expect(mockOnMouseMove).toHaveBeenCalled();

            const notMockReferenceArea = await screen.queryByTestId('mock-reference-area')
            expect(notMockReferenceArea).not.toBeInTheDocument();
        });
    });


});
