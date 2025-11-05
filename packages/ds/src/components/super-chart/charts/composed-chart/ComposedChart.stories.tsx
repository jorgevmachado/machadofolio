import type { Meta, StoryObj } from '@storybook/react-vite';

import SuperChart from '../../SuperChart';

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

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'composed',
        title: 'Composed Chart Title',
        tooltip: {
            filterContent: [
                {
                    by: 'label',
                    label: 'name',
                    condition: '!=='
                },
                {
                    by: 'value',
                    label: 'name',
                    condition: 'empty'
                }
            ],
            withDefaultTooltip: true
        },
        composedChart: {
            areas: [{
                key: 'amt',
                fill: '#8884d8',
                type: 'monotone',
                stroke: '#8884d8',
                dataKey: 'amt',
            }],
            bars: [{
                key: 'pv',
                fill: '#413ea0',
                dataKey: 'pv',
                barSize: 20,
            }],
            lines: [{
                key: 'uv',
                type: 'monotone',
                stroke: '#ff7300',
                dataKey: 'uv',
            }],
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
            scatters: [{
                key: 'cnt',
                fill: 'red',
                dataKey: 'cnt',
            }],
            cartesianGrid: {
                stroke: '#f5f5f5'
            },
            data,
        },
        subtitle: 'Composed Chart Subtitle',
        children: 'Hello, World!',
    },
    title: 'Components/SuperChart/ComposedChart',
    argTypes: {},
    component: SuperChart,
    parameters: {},
} satisfies Meta<typeof SuperChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {}
};

export const SameDataComposedChart: Story = {
    args: {
        title: 'Same Data Composed Chart',
        subtitle: undefined,
        children: undefined,
        composedChart: {
            data,
            xAxis: [{
                key: 'x-axis',
                scale: 'band',
                dataKey:'name',
            }],
            yAxis: [{
                key: 'y-axis',
                width: 'auto',
            }],
            bars: [{
                key: 'uv',
                fill: '#413ea0',
                dataKey: 'uv',
                barSize: 20,
            }],
            lines: [{
                key: 'uv',
                type: 'monotone',
                stroke: '#ff7300',
                dataKey: 'uv',
            }],
        }
    }
};

export const VerticalComposedChart: Story = {
    args: {
        title: 'Vertical Composed Chart',
        subtitle: undefined,
        children: undefined,
        composedChart: {
            data,
            layout: 'vertical',
            xAxis: [{
                key: 'x-axis',
                type: 'number',
            }],
            yAxis: [{
                key: 'y-axis',
                type: 'category',
                width: 'auto',
                scale: 'band',
                dataKey: 'name',
            }],
            areas: [{
                key: 'amt',
                fill: '#8884d8',
                stroke: '#8884d8',
                dataKey: 'amt',
            }],
            bars: [{
                key: 'pv',
                fill: '#413ea0',
                dataKey: 'pv',
                barSize: 20,
            }],
            lines: [{
                key: 'uv',
                stroke: '#ff7300',
                dataKey: 'uv',
            }],
        }
    }
};

export const ComposedChartWithAxisLabels: Story = {
    args: {
        title: 'Composed Chart With Axis Labels',
        subtitle: undefined,
        children: undefined,
        composedChart: {
            data,
            xAxis: [{
                key: 'x-axis',
                label: {
                    value: 'Pages',
                    offset: 0,
                    position: 'insideBottomRight'
                },
                scale: 'band',
                dataKey: 'name',
            }],
            yAxis: [{
                key: 'y-axis',
                label: {
                    value: 'Index',
                    angle: -90,
                    position: 'insideLeft'
                },
                width: 'auto',
            }],
            areas: [{
                key: 'amt',
                fill: '#8884d8',
                type: 'monotone',
                stroke: '#8884d8',
                dataKey: 'amt',
            }],
            bars: [{
                key: 'pv',
                fill: '#413ea0',
                dataKey: 'pv',
                barSize: 20,
            }],
            lines: [{
                key: 'uv',
                type: 'monotone',
                stroke: '#ff7300',
                dataKey: 'uv',
            }],
        }
    }
};

export const ScatterAndLineOfBestFit: Story = {
    args: {
        title: 'Scatter And Line Of Best Fit',
        subtitle: undefined,
        children: undefined,
        composedChart: {
            data: [
                { index: 10000, red: 1643, blue: 790 },
                { index: 1666, red: 182, blue: 42 },
                { index: 625, red: 56, blue: 11 },
                { index: 300, redLine: 0 },
                { index: 10000, redLine: 1522 },
                { index: 600, blueLine: 0 },
                { index: 10000, blueLine: 678 },
            ],
            xAxis: [{
                key: 'x-axis',
                type: 'number',
                label: {
                    value: 'Index',
                    offset: 0,
                    position: 'insideBottomRight'
                },
                dataKey: 'index',
            }],
            yAxis: [{
                key: 'y-axis',
                unit: 'ms',
                type: 'number',
                label: {
                    value: 'Time',
                    angle: -90,
                    position: 'insideLeft'
                },
                width: 'auto',
            }],
            lines: [
                {
                    key: 'blue-line',
                    dot: false,
                    stroke: 'blue',
                    dataKey: 'blueLine',
                    activeDot: false,
                    legendType: 'none',
                },
                {
                    key: 'red-line',
                    dot: false,
                    stroke: 'red',
                    dataKey: 'redLine',
                    activeDot: false,
                    legendType: 'none',
                }
            ],
            scatters: [
                {
                    key: 'red',
                    fill: 'red',
                    name: 'red',
                    dataKey: 'red',
                },
                {
                    key: 'blue',
                    fill: 'blue',
                    name: 'blue',
                    dataKey: 'blue',
                }
            ],
        }
    }
};

export const BandedChart: Story = {
    args: {
        title: 'Banded Chart',
        subtitle: undefined,
        children: undefined,
        legend: {
            show: true,
            filterContent: {
                label: 'dataKey',
                value: 'a',
                condition: '!=='
            }
        },
        tooltip: {
            filterContent: [{
                label: 'dataKey',
                value: 'a',
                condition: '!=='
            }],
            withDefaultTooltip: true
        },
        composedChart: {
            data: [
                {
                    name: 'Page A',
                    a: [0, 0],
                    b: 0,
                },
                {
                    name: 'Page B',
                    a: [50, 300],
                    b: 106,
                },
                {
                    name: 'Page C',
                    a: [150, 423],
                    b: 229,
                },
                {
                    name: 'Page D',
                    b: 312,
                },
                {
                    name: 'Page E',
                    a: [367, 678],
                    b: 451,
                },
                {
                    name: 'Page F',
                    a: [305, 821],
                    b: 623,
                },
            ],
            xAxis: [{
                key: 'x-axis',
                dataKey: 'name',
            }],
            yAxis: [{
                key: 'y-axis',
                width: 'auto',
            }],
            areas: [{
                key: 'a',
                dot: false,
                type: 'monotone',
                fill: '#cccccc',
                stroke: 'none',
                dataKey: 'a',
                activeDot: false,
                connectNulls: true,
            }],
            lines: [{
                    key: 'b',
                    type: 'natural',
                    stroke: '#ff00ff',
                    dataKey: 'b',
                    connectNulls: true,
            }],
            cartesianGrid: {
                strokeDasharray: '3 3'
            }
        }
    }
};

