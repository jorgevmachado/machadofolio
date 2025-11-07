import type { Meta, StoryObj } from '@storybook/react-vite';

import SuperChart from '../../SuperChart';

const data = [
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

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'area',
        title: 'Area Chart Title',
        areaChart: {
            data,
            labels: [{
                key: 'uv',
                fill: '#8884d8',
                type: 'monotone',
                stroke: '#8884d8',
                dataKey: 'uv'
            }],
            responsive: true
        },
        tooltip: {
            labelProps: {
                tag: 'h3',
            },
            nameProps: {
                show: false
            },
            genericTextProps: {
                show: true,
                withName: true,
                withValue: true
            }
        },
        subtitle: 'Area Chart Subtitle',
        children: 'Hello, World!',
        responsive: true,
    },
    title: 'Components/SuperChart/AreaChart',
    argTypes: {},
    component: SuperChart,
    parameters: {},
} satisfies Meta<typeof SuperChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {}
};

export const StackedAreaChart: Story = {
    args: {
        title: 'Stacked Area Chart',
        children: undefined,
        subtitle: undefined,
        areaChart: {
            data,
            labels: [
                {
                    key: 'uv',
                    fill: '#8884d8',
                    type: 'monotone',
                    stroke: '#8884d8',
                    stackId: '1',
                    dataKey: 'uv'
                },
                {
                    key: 'pv',
                    fill: '#82ca9d',
                    type: 'monotone',
                    stroke: '#82ca9d',
                    stackId: '1',
                    dataKey: 'pv'
                },
                {
                    key: 'amt',
                    fill: '#ffc658',
                    type: 'monotone',
                    stroke: '#ffc658',
                    stackId: '1',
                    dataKey: 'amt'
                }
            ]
        }
    }
}

export const AreaChartConnectNulls: Story = {
    args: {
        title: 'Area Chart Connect Nulls',
        children: undefined,
        subtitle: undefined,
        areaChart: {
            data: data.map((item) => {
                if(item.name === 'Page D') {
                    return {
                        name: 'Page D',
                        pv: 3908,
                        amt: 2000,
                    }
                }
                return item;
            }),
            labels: [{
                key: 'uv',
                fill: '#8884d8',
                type: 'monotone',
                stroke: '#8884d8',
                dataKey: 'uv'
            }],
        }
    }
}

export const CardinalAreaChart: Story = {
    args: {
        title: 'Cardinal Area Chart',
        children: undefined,
        subtitle: undefined,
        areaChart: {
            data,
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
        },
    }
}

export const PercentAreaChart: Story = {
    args: {
        title: 'Percent Area Chart',
        xAxis: [{ key: 'x-axis-0', dataKey: 'month' }],
        children: undefined,
        subtitle: undefined,
        tooltip: {
            labelProps: {
                tag: 'h3',
                weight: 'bold'
            },
            nameProps: {
                show: false
            },
            genericTextProps: {
                show: true,
                withName: true,
                withValue: true,
                withTotalPercent: true
            },
            withTotalPercent: true
        },
        areaChart: {
            data: [
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
                    fill: '#8884d8',
                    type: 'monotone',
                    stroke: '#8884d8',
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
            stackOffset: 'expand',
        }
    }
}

export const TinyAreaChart: Story = {
    args: {
        title: 'Tiny Area Chart',
        xAxis: [],
        yAxis: [],
        children: undefined,
        subtitle: undefined,
        tooltip: {
            show: false
        },
        areaChart: {
            data,
            margin: {
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
            },
            style: { width: '100%', maxWidth: '300px', maxHeight: '100px', aspectRatio: 1.618 },
            labels: [{
                key: 'uv',
                fill: '#8884d8',
                type: 'monotone',
                stroke: '#8884d8',
                dataKey: 'uv'
            }],
        }
    }
}

export const AreaChartFillByValue: Story = {
    args: {
        title: 'Area Chart Fill By Value',
        children: undefined,
        subtitle: undefined,
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
        }
    }
}