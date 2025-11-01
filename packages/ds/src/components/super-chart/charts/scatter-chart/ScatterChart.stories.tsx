import type { Meta, StoryObj } from '@storybook/react-vite';

import SuperChart from '../../SuperChart';

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'scatter',
        title: 'Scatter Chart Title',
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
            withLegend: true,
        },
        subtitle: 'Scatter Chart Subtitle',
        children: 'Hello, World!',
    },
    title: 'Components/SuperChart/ScatterChart',
    argTypes: {},
    component: SuperChart,
    parameters: {},
} satisfies Meta<typeof SuperChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {}
};

export const ThreeDimScatterChart: Story = {
    args: {
        title: 'Three Dim Scatter Chart',
        subtitle: undefined,
        children: undefined,
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
                    shape: 'star',
                },
                {
                    key: 'school-b',
                    fill: '#82ca9d',
                    data: [
                        { x: 200, y: 260, z: 240 },
                        { x: 240, y: 290, z: 220 },
                        { x: 190, y: 290, z: 250 },
                        { x: 198, y: 250, z: 210 },
                        { x: 180, y: 280, z: 260 },
                        { x: 210, y: 220, z: 230 },
                    ],
                    name: 'B school',
                    shape: 'triangle',
                }
            ],
            yAxis: [{
                unit: 'kg',
                type: 'number',
                name: 'weight',
                width: 'auto',
                dataKey: 'y',
            }],
            zAxis: [{
                unit: 'km',
                type: 'number',
                name: 'score',
                range: [60, 400],
                dataKey: 'z',
            }],
            withLegend: true,
        },
    }
}

export const JointLineScatterChart: Story = {
    args: {
        title: 'Joint Line Scatter Chart',
        subtitle: undefined,
        children: undefined,
        scatterChart: {
            data: [
                {
                    key: 'school-a',
                    fill: '#8884d8',
                    data: [
                        { x: 10, y: 30 },
                        { x: 30, y: 200 },
                        { x: 45, y: 100 },
                        { x: 50, y: 400 },
                        { x: 70, y: 150 },
                        { x: 100, y: 250 },
                    ],
                    line: true,
                    name: 'A school',
                    shape: 'cross',
                },
                {
                    key: 'school-b',
                    fill: '#82ca9d',
                    data: [
                        { x: 30, y: 20 },
                        { x: 50, y: 180 },
                        { x: 75, y: 240 },
                        { x: 100, y: 100 },
                        { x: 120, y: 190 },
                    ],
                    line: true,
                    name: 'B school',
                    shape: 'diamond',
                }
            ],
            xAxis: [{
                unit: 'cm',
                type: 'number',
                name: 'stature',
                dataKey: 'x'
            }],
            yAxis: [{
                unit: 'kg',
                type: 'number',
                name: 'weight',
                width: 'auto',
                dataKey: 'y',
            }],
            zAxis: [{
                type: 'number',
                range: [100, 100],
            }],
            withLegend: true,
        },
    }
};

const data1 = [
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

const data2 = [
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

export const BubbleChart: Story = {
    args: {
        title: 'Bubble Chart',
        subtitle: undefined,
        children: undefined,
        tooltip: {
            wrapperStyle: { zIndex: 100 }
        },
        scatterChart: {
            type: 'bubble',
            data: [
                {
                    key: 'sunday',
                    fill: '#8884d8',
                    name: 'Sunday',
                    data: data1,
                },
                {
                    key: 'monday',
                    fill: '#8884d8',
                    data: data2,
                    name: 'Monday',
                },
                {
                    key: 'tuesday',
                    fill: '#8884d8',
                    data: data1,
                    name: 'Tuesday',
                },
                {
                    key: 'wednesday',
                    fill: '#8884d8',
                    data: data2,
                    name: 'Wednesday',
                },
                {
                    key: 'thursday',
                    fill: '#8884d8',
                    data: data1,
                    name: 'Thursday',
                },
                {
                    key: 'friday',
                    fill: '#8884d8',
                    data: data2,
                    name: 'Friday',
                },
                {
                    key: 'Saturday',
                    fill: '#8884d8',
                    data: data1,
                    name: 'saturday',
                    showTicks: true
                },
            ],
            range: [16, 225],
            style: { width: '100%', minWidth: '700px', maxWidth: '900px', height: '60px' },
            margin: { top: 10, right: 0, bottom: 0, left: 0 },
            xAxis: [{
                tick: { fontSize: 0 },
                type: "category",
                name: "hour",
                dataKey: "hour",
                interval: 0,
                tickLine: { transform: 'translate(0, -6)' },
            }],
            yAxis: [{
                tick: false,
                name: 'sunday',
                type: 'number',
                width: 80,
                height: 10,
                dataKey: 'index',
                tickLine: false,
                axisLine: false,
                label: { position: 'insideRight' },
            }],
            zAxis: [{
                type: 'number',
                dataKey: 'value',
            }],
            domain: [ 0,
                Math.max(
                    Math.max.apply(
                        null,
                        data1.map(entry => entry.value),
                    ),
                    Math.max.apply(
                        null,
                        data2.map(entry => entry.value),
                    ),
                )],
            bubbleStyle: { width: '100%', maxWidth: '900px' },
        },
        chartTooltip: {
            style: {
                color: '#000',
                backgroundColor: '#fff',
                border: '1px solid #999',
                margin: 0,
                padding: 10,
            },
            nameProps: {
                show: false
            },
            valueProps: {
                withCurrencyFormatter: false
            }
        }
    }
};

export const ScatterChartWithLabels: Story = {
    args: {
        title: 'Scatter Chart With Labels',
        subtitle: undefined,
        children: undefined,
        scatterChart: {
            data: [
                {
                    key: 'a-school',
                    fill: '#8884d8',
                    name: 'A school',
                    data: [
                        { x: 100, y: 200, z: 200 },
                        { x: 120, y: 100, z: 260 },
                        { x: 170, y: 300, z: 400 },
                        { x: 140, y: 250, z: 280 },
                        { x: 150, y: 400, z: 500 },
                        { x: 110, y: 280, z: 200 },
                    ],
                    labelList: {
                        fill: 'black',
                        dataKey: 'x'
                    }
                },
            ],
            zAxis: [{
                range: [900, 4000],
                dataKey: 'z',
            }],
            domain: [ 0,
                Math.max(
                    Math.max.apply(
                        null,
                        data1.map(entry => entry.value),
                    ),
                    Math.max.apply(
                        null,
                        data2.map(entry => entry.value),
                    ),
                )],
            bubbleStyle: { width: '100%', maxWidth: '900px' },
        },
        tooltip: {
            wrapperStyle: { zIndex: 100 },
            withContent: false
        },
        chartTooltip: {
            style: {
                color: '#000',
                backgroundColor: '#fff',
                border: '1px solid #999',
                margin: 0,
                padding: 10,
            },
            nameProps: {
                show: false
            },
            valueProps: {
                withCurrencyFormatter: false
            }
        }
    }
};

export const MultipleYAxesScatterChart: Story = {
    args: {
        title: 'Multiple Y Axes Scatter Chart',
        subtitle: undefined,
        children: undefined,
        scatterChart: {
            style: { width: '100%', maxWidth: '300px', maxHeight: '70vh', aspectRatio: 1.618 },
            xAxis: [
                {
                    type: "number",
                    dataKey: "x",
                    name: "stature",
                    unit: "cm"
                },
            ],
            yAxis: [
                {
                    yAxisId:"left",
                    type:"number",
                    dataKey:"y",
                    name:"weight",
                    unit:"kg",
                    stroke:"#8884d8",
                    width:"auto"
                },
                {
                    yAxisId: "right",
                    type: "number",
                    dataKey: "y",
                    name: "weight",
                    unit: "kg",
                    orientation: "right",
                    stroke: "#82ca9d",
                    width: "auto",
                }
            ],
            data: [
                {
                    yAxisId: "left",
                    name: "A school",
                    fill: "#8884d8",
                    data: [
                        { x: 100, y: 200, z: 200 },
                        { x: 120, y: 100, z: 260 },
                        { x: 170, y: 300, z: 400 },
                        { x: 140, y: 250, z: 280 },
                        { x: 150, y: 400, z: 500 },
                        { x: 110, y: 280, z: 200 },
                    ]
                },
                {
                    yAxisId:"right",
                    name:"A school",
                    data: [
                        { x: 300, y: 300, z: 200 },
                        { x: 400, y: 500, z: 260 },
                        { x: 200, y: 700, z: 400 },
                        { x: 340, y: 350, z: 280 },
                        { x: 560, y: 500, z: 500 },
                        { x: 230, y: 780, z: 200 },
                        { x: 500, y: 400, z: 200 },
                        { x: 300, y: 500, z: 260 },
                        { x: 240, y: 300, z: 400 },
                        { x: 320, y: 550, z: 280 },
                        { x: 500, y: 400, z: 500 },
                        { x: 420, y: 280, z: 200 },
                    ],
                    fill:"#82ca9d",
                }
            ],
        }
    }
};

// TODO FALTA FINALIZAR
export const ScatterChartWithCells: Story = {
    args: {
        title: 'Scatter Chart With Cells',
        subtitle: undefined,
        children: undefined,
        scatterChart: {
            style: { width: '100%', maxWidth: '300px', maxHeight: '70vh', aspectRatio: 1.618 },
            data: [
                {
                    name: "A school",
                    fill: "#8884d8",
                    data: [
                        { x: 100, y: 200, z: 200, fill: '#0088FE' },
                        { x: 120, y: 100, z: 260, fill: '#00C49F' },
                        { x: 170, y: 300, z: 400, fill: '#FFBB28' },
                        { x: 140, y: 250, z: 280, fill: '#FF8042' },
                        { x: 150, y: 400, z: 500, fill: 'red' },
                        { x: 110, y: 280, z: 200, fill: 'pink' },
                    ],
                    withCell: true
                },
            ],
        }
    }
};