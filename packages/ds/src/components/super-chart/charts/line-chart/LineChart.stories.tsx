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
        type: 'line',
        title: 'Line Chart Title',
        tooltip: {
            withDefaultTooltip: true,
        },
        lineChart: {
            data,
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
    },
    title: 'Components/SuperChart/LineChart',
    argTypes: {},
    component: SuperChart,
    parameters: {},
} satisfies Meta<typeof SuperChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {}
};

export const DashedLineChart: Story = {
    args: {
        title: 'Dashed Line Chart',
        subtitle: undefined,
        children: undefined,
        lineChart: {
            data,
            labels: [
                {
                    key: 'pv',
                    type: 'monotone',
                    stroke: '#8884d8',
                    dataKey: 'pv',
                    strokeDasharray: '5 5'
                },
                {
                    key: 'uv',
                    type: 'monotone',
                    stroke: '#82ca9d',
                    dataKey: 'uv',
                    strokeDasharray: '3 4 5 2'
                }
            ],

        }
    }
};

export const VerticalLineChart: Story = {
    args: {
        title: 'Vertical Line Chart',
        subtitle: undefined,
        children: undefined,
        lineChart: {
            data,
            xAxis: [{
                key: 'x-0',
                type: 'number',
            }],
            yAxis: [{
                key: 'y-0',
                type: 'category',
                width: 'auto',
                dataKey: 'name',
            }],
            labels: [
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
            ],
            layout: 'vertical',

        }
    }
};

export const BiaxialLineChart: Story = {
    args: {
        title: 'Biaxial Line Chart',
        subtitle: undefined,
        children: undefined,
        lineChart: {
            data,
            yAxis: [
                { key: 'y-0', width: 'auto', yAxisId: 'left' },
                { key: 'y-1', width: 'auto', yAxisId: 'right', orientation: 'right' },
            ],
            labels: [
                {
                    key: 'pv',
                    type: 'monotone',
                    stroke: '#8884d8',
                    dataKey: 'pv',
                    yAxisId: 'left',
                    activeDot: { r: 8 },
                },
                {
                    key: 'uv',
                    type: 'monotone',
                    stroke: '#82ca9d',
                    dataKey: 'uv',
                    yAxisId: 'right',
                }
            ],
            margin: { top: 15, right: 0, left: 0, bottom: 5 },

        }
    }
};

export const VerticalLineChartWithSpecifiedDomain: Story = {
    args: {
        title: 'Vertical Line Chart With Specified Domain',
        subtitle: undefined,
        children: undefined,
        lineChart: {
            data,
            xAxis: [{ key: 'x-0', type: 'number', domain: [0, 'dataMax + 1000'] }],
            yAxis: [{ key: 'y-0', type: 'category', width: 'auto', dataKey: 'name' }],
            labels: [
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
            ],
            layout: 'vertical',
            style: { maxWidth: '300px', aspectRatio: 1 / 1.618 },
            margin: { top: 20, right: 0, left: 0, bottom: 5 },

        }
    }
}

export const LineChartConnectNulls: Story = {
    args: {
        title: 'Line Chart Connect Nulls',
        subtitle: undefined,
        children: undefined,
        lineChart: {
            data: [
                { name: 'Page A', uv: 4000 },
                { name: 'Page B', uv: 3000 },
                { name: 'Page C', uv: 2000 },
                { name: 'Page D' },
                { name: 'Page E', uv: 1890 },
                { name: 'Page F', uv: 2390 },
                { name: 'Page G', uv: 3490 },
            ],
            xAxis: [{ key: 'x-0', dataKey: 'name' }],
            labels: [
                {
                    key: 'uv',
                    type: 'monotone',
                    fill: '#8884d8',
                    stroke: '#8884d8',
                    dataKey: 'uv',
                }
            ],
            style: { maxHeight: '30vh' },
            margin: { top: 10, right: 30, left: 0, bottom: 0 },

        }
    }
}

export const LineChartWithXAxisPadding: Story = {
    args: {
        title: 'Line Chart With X Axis Padding',
        subtitle: undefined,
        children: undefined,
        lineChart: {
            data,
            xAxis: [{ key: 'x-0', dataKey: 'name', padding: {left: 30, right: 30 } }],
            labels: [
                {
                    key: 'pv',
                    type: 'monotone',
                    stroke: '#8884d8',
                    dataKey: 'pv',
                    activeDot: { r: 8 }
                },
                {
                    key: 'uv',
                    type: 'monotone',
                    stroke: '#82ca9d',
                    dataKey: 'uv',
                }
            ],

        }
    }
}

export const LineChartWithReferenceLines: Story = {
    args: {
        title: 'Line Chart With Reference Lines',
        subtitle: undefined,
        children: undefined,
        lineChart: {
            data,
            labels: [
                {
                    key: 'pv',
                    type: 'monotone',
                    stroke: '#8884d8',
                    dataKey: 'pv',
                },
                {
                    key: 'uv',
                    type: 'monotone',
                    stroke: '#82ca9d',
                    dataKey: 'uv',
                }
            ],
            margin: { top: 20, right: 0, left: 0, bottom: 5 },

            referenceLines: [
                {
                    x: 'Page C',
                    label: 'Max PV PAGE',
                    show: true,
                    stroke: 'red',
                },
                {
                    y: 9800,
                    label: 'Max',
                    show: true,
                    stroke: 'red',
                }
            ]
        }
    }
}

export const CustomizedDotLineChart: Story = {
    args: {
        title: 'Customized Dot Line Chart',
        subtitle: undefined,
        children: undefined,
        lineChart: {
            data,
            labels: [
                {
                    key: 'pv',
                    type: 'monotone',
                    stroke: '#8884d8',
                    dataKey: 'pv',
                    customDot: { maxValue: 2500 }
                },
                {
                    key: 'uv',
                    type: 'monotone',
                    stroke: '#82ca9d',
                    dataKey: 'uv',
                }
            ],
            margin: { top: 5, right: 10, left: 0, bottom: 5 },

        }
    }
}

export const CustomizedLabelLineChart: Story = {
    args: {
        title: 'Customized Label Line Chart',
        subtitle: undefined,
        children: undefined,
        lineChart: {
            data,
            labels: [
                {
                    key: 'pv',
                    type: 'monotone',
                    stroke: '#8884d8',
                    dataKey: 'pv',
                    customLabel: { dy: -4 }
                },
                {
                    key: 'uv',
                    type: 'monotone',
                    stroke: '#82ca9d',
                    dataKey: 'uv',
                }
            ],
            xAxis: [{
                key: 'x-0',
                height: 60,
                dataKey: 'name',
                customAxisTick: { fill: '#666'}
            }],
            margin: { top: 20, right: 0, left: 0, bottom: 10 },

        }
    }
}

export const HighlightAndZoomLineChart: Story = {
    args: {
        title: 'Highlight And Zoom Line Chart',
        subtitle: undefined,
        children: undefined,
        lineChart: {
            data:[
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
            ],
            labels: [
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
            ],
            xAxis: [{
                key: 'x-0',
                type: 'number',
                dataKey: 'name',
                customDomain: ['left', 'right'],
                allowDataOverflow: true,
            }],
            yAxis: [
                {
                    key: 'y-0',
                    type: 'number',
                    width: 'auto',
                    yAxisId: '1',
                    customDomain: ['bottom', 'top'],
                    allowDataOverflow: true,
                },
                {   key: 'y-1',
                    type: 'number',
                    width: 'auto',
                    yAxisId: '2',
                    orientation: 'right',
                    customDomain: ['bottom2', 'top2'],
                    allowDataOverflow: true,
                }
            ],
            withZoom: true,

            referenceArea: {
                yAxisId: '1',
                strokeOpacity: 0.3
            },
            buttonZoomOut: {
                id: 'zoom-out',
                context: 'primary',
                children: 'Zoom Out'
            }
        }
    }
}

export const LineChartHasMultiSeries: Story = {
    args: {
        title: 'Line Chart Has Multi Series',
        subtitle: undefined,
        children: undefined,
        lineChart: {
            xAxis: [{
                key: 'x-0',
                type: 'category',
                dataKey: 'category',
                allowDuplicatedCategory: false,
            }],
            yAxis: [{
                key: 'y-0',
                    width: 'auto',
                    dataKey: 'value'
            }],
            style: {
                width: '100%',
                maxWidth: '700px',
                maxHeight: '70vh',
                aspectRatio: 1.618
            },
            labels: [
                {
                    key: 'series-1',
                    name: 'Series 1',
                    dataKey: 'value',
                    data: [
                        { key: 'A', name: 'A', category: 'A', value: 0.1 },
                        { key: 'B', name: 'B', category: 'B', value: 0.2 },
                        { key: 'C', name: 'C', category: 'C', value: 0.3 },
                    ],
                },
                {
                    key: 'series-2',
                    name: 'Series 2',
                    dataKey: 'value',
                    data: [
                        { key: 'B2', name: 'B', category: 'B', value: 0.4 },
                        { key: 'C2', name: 'C', category: 'C', value: 0.5 },
                        { key: 'D2', name: 'D', category: 'D', value: 0.6 },
                    ],
                },
                {
                    key: 'series-3',
                    name: 'Series 3',
                    dataKey: 'value',
                    data: [
                        { key: 'C3', name: 'C', category: 'C', value: 0.7 },
                        { key: 'D3', name: 'D', category: 'D', value: 0.8 },
                        { key: 'E3', name: 'E', category: 'E', value: 0.9 },
                    ],
                },
            ],
            margin: { top: 10,  right: 5 },

        }
    }
}

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

export const LineChartNegativeValuesWithReferenceLines: Story = {
    args: {
        title: 'Line Chart Negative Values With Reference Lines',
        subtitle: undefined,
        children: undefined,
        lineChart: {
            style: { width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 },
            yAxis: [{
                key: 'y-0',
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
            }],
            xAxis: [{
                key: 'x-0',
                dataKey:"x",
                domain:['auto', 'auto'],
                interval:0,
                type:"number",
                label:{ key: 'xAxisLabel', value: 'x', position: 'bottom' },
                allowDataOverflow: true,
                strokeWidth: minY < 0 ? 0 : 1,
            }],
            labels: [{
                key: 'y',
                strokeWidth: 2,
                data: lineChartNegativeValuesWithReferenceLinesData,
                dot: false,
                type: 'monotone',
                dataKey: 'y',
                stroke: 'black',
                tooltipType: 'none'
            }],
            referenceLines: [
                {
                    y: 0,
                    show: minY < 0,
                    stroke: 'gray',
                    strokeWidth: 1.5,
                    strokeOpacity: 0.65
                },
                {
                    x: 0,
                    show: minX < 0,
                    stroke: 'gray',
                    strokeWidth: 1.5,
                    strokeOpacity: 0.65
                }
            ]
        }
    }
}