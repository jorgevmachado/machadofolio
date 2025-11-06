import type { Meta, StoryObj } from '@storybook/react-vite';

import SuperChart from '../../SuperChart';

const mockPies = [
    {
        cx: '50%',
        cy: '50%',
        key: 'inner',
        fill: '#8884d8',
        data: [
            { name: 'Group A', value: 400 },
            { name: 'Group B', value: 300 },
            { name: 'Group C', value: 300 },
            { name: 'Group D', value: 200 },
        ],
        dataKey: 'value',
        outerRadius: '50%',
        isAnimationActive: true
    },
    {
        cx: '50%',
        cy: '50%',
        key: 'outer',
        fill: '#82ca9d',
        data: [
            { name: 'A1', value: 100 },
            { name: 'A2', value: 300 },
            { name: 'B1', value: 100 },
            { name: 'B2', value: 80 },
            { name: 'B3', value: 40 },
            { name: 'B4', value: 30 },
            { name: 'B5', value: 50 },
            { name: 'C1', value: 100 },
            { name: 'C2', value: 200 },
            { name: 'D1', value: 150 },
            { name: 'D2', value: 50 },
        ],
        label: true,
        dataKey: 'value',
        innerRadius: '60%',
        outerRadius: '80%',
        isAnimationActive: true
    }
]



const meta = {
    tags: ['autodocs'],
    args: {
        type: 'pie',
        title: 'Pie Chart Title',
        pieChart: {
            data: mockPies
        },
        subtitle: 'Pie Chart Subtitle',
        children: 'Hello, World!',
        legend: {
            show: false
        },
    },
    title: 'Components/SuperChart/PieChart',
    argTypes: {},
    component: SuperChart,
    parameters: {},
} satisfies Meta<typeof SuperChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {}
};

export const StraightAnglePieChart: Story = {
    args: {
        title: 'Straight Angle Pie Chart',
        subtitle: undefined,
        pieChart: {
            data: [{
                cx: '50%',
                cy: '100%',
                key: 'straight-angle',
                fill: '#8884d8',
                data: [
                    { name: 'Group A', value: 400 },
                    { name: 'Group B', value: 300 },
                    { name: 'Group C', value: 300 },
                    { name: 'Group D', value: 200 },
                    { name: 'Group E', value: 278 },
                    { name: 'Group F', value: 189 },
                ],
                label: true,
                dataKey: 'value',
                endAngle: 0,
                startAngle: 180,
                outerRadius: '120%',
                isAnimationActive: true
            }],
            style: {
                aspectRatio: 2,
            }
        },
        children: undefined
    }
};

export const CustomActiveShapePieChart: Story = {
    args: {
        title: 'Custom Active Shape Pie Chart',
        subtitle: undefined,
        pieChart: {
            data: [
                {
                    cx: '50%',
                    cy: '50%',
                    key: 'straight-angle',
                    fill: '#8884d8',
                    data: [
                        { name: 'Group A', value: 400 },
                        { name: 'Group B', value: 300 },
                        { name: 'Group C', value: 300 },
                        { name: 'Group D', value: 200 },
                    ],
                    label: false,
                    dataKey: 'value',
                    innerRadius: '60%',
                    outerRadius: '80%',
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
            style: {
                aspectRatio: 2,
            },
            margin: {
                top: 50,
                right: 120,
                bottom: 50,
                left: 120,
            },
            withDefaultActiveShape: true
        },
        tooltip: {
            withContent: false
        },
        children: undefined
    }
};

export const PieChartWithCustomizedLabel: Story = {
    args: {
        title: 'Pie Chart With Customized Label',
        subtitle: undefined,
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
        tooltip: {
            withContent: false
        },
        children: undefined
    }
};

export const PieChartWithGapAndRoundedCorners: Story = {
    args: {
        title: 'Pie Chart with gap and rounded corners',
        subtitle: undefined,
        pieChart: {
            data: [
                {
                    key: 'pie_chart_with_gap_and_rounded_corners',
                    fill: '#8884d8',
                    data: [
                        { fill: '#0088FE', name: 'Group A', value: 400  },
                        { fill: '#00C49F', name: 'Group B', value: 300 },
                        { fill: '#FFBB28', name: 'Group C', value: 300 },
                        { fill: '#FF8042', name: 'Group D', value: 200  },
                    ],
                    dataKey: 'value',
                    innerRadius: '80%',
                    outerRadius: '100%',
                    paddingAngle: 5,
                    cornerRadius: '50%',
                    isAnimationActive: true,
                }
            ],
        },
        children: undefined
    }
};

export const PieChartWithNeedle: Story = {
    args: {
        title: 'Pie Chart With Needle',
        subtitle: undefined,
        pieChart: {
            data: [
                {
                    key: 'pie_chart_with_needle',
                    cx: 100,
                    cy: 100,
                    fill: '#8884d8',
                    data: [
                        { fill: '#ff0000', name: 'A', value: 80  },
                        { fill: '#00ff00', name: 'B', value: 45 },
                        { fill: '#FFBB28', name: 'C', value: 25 },
                    ],
                    value: 50,
                    color: '#d0d000',
                    dataKey: 'value',
                    endAngle:  0,
                    startAngle: 180,
                    innerRadius: 50,
                    outerRadius: 100,
                    isAnimationActive: true,
                }
            ],
            style: { margin: '0 auto', width: 210, height: 120 },
            withNeedle: true,
        },
        children: undefined
    }
};