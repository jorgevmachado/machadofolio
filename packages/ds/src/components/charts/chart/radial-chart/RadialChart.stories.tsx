import type { Meta, StoryObj } from '@storybook/react-vite';

import Charts from '../../Charts';

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

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'radial',
        title: 'Radial Chart Title',
        tooltip: {
            withContent: false
        },
        radialChart: {
            data,
            labels:  [{
                key: 'uv',
                fill: '#fff',
                dataKey: 'uv',
                position: 'insideStart',
                background: true
            }],
        },
        subtitle: 'Radial Chart Subtitle',
        children: 'Hello, World!',
    },
    title: 'Components/Charts/RadialChart',
    argTypes: {},
    component: Charts,
    parameters: {},
} satisfies Meta<typeof Charts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {}
};