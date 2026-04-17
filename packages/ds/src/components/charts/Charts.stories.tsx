import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import Charts from './Charts';

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'area',
        title: 'Charts Title',
        subtitle: 'Chart Subtitle',
        children: 'Hello, World!',
    },
    title: 'Components/Charts',
    argTypes: {},
    component: Charts,
    parameters: {},
} satisfies Meta<typeof Charts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        fallback: {
            text: 'No data available',
            action: {
                size: 'small',
                onClick: fn(),
                context: 'primary',
                children: 'Create'
            }
        },
        barChart: {
            data: [],
        }
    }
};

export const AreaChart: Story = {
    args: {
        type: 'area',
        title: 'Area Chart',
        subtitle: 'Area Chart Subtitle',
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
            ],
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
        children: 'Hello, Area Chart!',
        responsive: true,
    }
}

export const BarChart: Story = {
    args: {
        type: 'bar',
        title: 'Bar Chart',
        subtitle: 'Bar Chart Subtitle',
        barChart: {
            data: [
                {
                    type: 'bank',
                    name: 'Nubank',
                    value: 400,
                    count: 4,
                    fill: '#9c44dc',
                    color: '#bc8ae1',
                    stroke: '#442c61',
                },
                {
                    type: 'bank',
                    name: 'Caixa',
                    value: 300,
                    count: 3,
                    fill: '#002060',
                    color: '#FF9933',
                    stroke: '#3b82f6'
                },
                {
                    type: 'bank',
                    name: 'Itaú',
                    value: 200,
                    count: 2,
                    fill: '#F88104',
                    color: '#FF6200',
                    stroke: '#004387'
                },
                {
                    type: 'bank',
                    name: 'Santander',
                    value: 100,
                    count: 1,
                    fill: '#EA1D25',
                    color: '#c2c2c2',
                    stroke: '#333333'
                },
            ],
            labels: [{
                key: 'value',
                fill: '#808080',
                radius: [8, 8, 0, 0],
                activeBar: { type: 'rectangle' }
            }],
        },
        tooltip: {
            countProps: {
                show: false
            },
        },
        children: 'Hello, Bar Chart!',
        withAxisCurrencyTickFormatter: true
    }
}

export const ComposedChart: Story = {
    args: {
        type: 'composed',
        title: 'Composed Chart',
        subtitle: 'Composed Chart Subtitle',
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
            scatters: [{
                key: 'cnt',
                fill: 'red',
                dataKey: 'cnt',
            }],
            cartesianGrid: {
                stroke: '#f5f5f5'
            },
            data: [
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
            ],
        },
    }
}

export const LineChart: Story = {
    args: {
        type: 'line',
        title: 'Line Chart',
        layout: 'horizontal',
        tooltip: {
            withDefaultTooltip: true,
        },
        lineChart: {
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
            ],
            labels: [
                {
                    key: 'pv',
                    type: 'monotone',
                    stroke: '#8884d8',
                    dataKey: 'pv',
                    activeDot: { r: 8 },
                },
                {
                    key: 'uv',
                    type: 'monotone',
                    stroke: '#82ca9d',
                    dataKey: 'uv',
                }
            ],
        },
        subtitle: 'Line Chart Subtitle',
        children: 'Hello, World!',
    }
}

export const PieChart: Story = {
    args: {
        type: 'pie',
        title: 'Pie Chart',
        pieChart: {
            data: [
                {
                    key: 'straight-angle',
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
            withDefaultCustomLabel: true
        },
        legend: {
            show: false
        },
        tooltip: {
            withContent: false
        },
        children: undefined
    }
}

export const RadarChart: Story = {
    args: {
        type: 'radar',
        title: 'Radar Chart',
        radarChart: {
            value: 'subject',
            data: [
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
            ],
            labels: [{
                key: 'mike',
                fill: '#8884d8',
                name: 'Mike',
                stroke: '#8884d8',
                dataKey: 'A',
                fillOpacity: 0.6,
            }]
        },
        legend: {
            show: false
        },
        tooltip: {
            withContent: false
        },
        children: undefined
    }
}

export const RadialChart: Story = {
    args: {
        type: 'radial',
        title: 'Radial Chart',
        radialChart: {
            data: [
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
            ],
            labels:  [{
                key: 'uv',
                fill: '#fff',
                dataKey: 'uv',
                position: 'insideStart',
                background: true
            }],
        },
        tooltip: {
            withContent: false
        },
        children: undefined
    }
}

export const ScatterChart: Story = {
    args: {
        type: 'scatter',
        title: 'Scatter Chart',
        scatterChart: {
            data: [
                {
                    key: 'school-a',
                    fill: '#8884d8',
                    data: [
                        { x: 100, y: 200, z: 200 },
                        { x: 120, y: 100, z: 260 },
                        { x: 170, y: 300, z: 400 },
                        { x: 140, y: 250, z: 280 },
                        { x: 150, y: 400, z: 500 },
                        { x: 110, y: 280, z: 200 },
                    ],
                    name: 'A school',
                }
            ],
        },
        tooltip: {
            withContent: false
        },
        children: undefined
    }
}