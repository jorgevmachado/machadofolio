import type { Meta, StoryObj } from '@storybook/react-vite';

import SuperChart from '../../SuperChart';

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
        az: 50000,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
        az: 50000,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
        az: 50000,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
        az: 50000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
        az: 50000,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
        az: 50000,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
        az: 50000,
    },
];

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'bar',
        title: 'Bar Chart Title',
        tooltip: {
            countProps: {
                show: false
            },
        },
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
            labels: [{ key: 'value', fill: '#808080', activeBar: { type: 'rectangle' } }],
            withCurrencyTickFormatter: true
        },
        subtitle: 'Bar Chart Subtitle',
        children: 'Hello, World!',
    },
    title: 'Components/SuperChart/BarChart',
    argTypes: {},
    component: SuperChart,
    parameters: {},
} satisfies Meta<typeof SuperChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {}
};

export const BarChartSimple: Story = {
    args: {
        title: 'Bar Chart Simple Title',
        barChart: {
            data,
            labels: [
                { key: 'uv', fill: '#9c44dc', activeBar: { type: 'rectangle', fill: '#bc8ae1', stroke: '#442c61', } },
                { key: 'pv', fill: '#002060', activeBar: { type: 'rectangle', fill: '#FF9933', stroke: '#3b82f6' } },
                { key: 'amt', fill: '#F88104', activeBar: { type: 'rectangle', fill: '#FF6200', stroke: '#004387' } },
            ]
        }
    }
}

export const MixBarChart: Story = {
    args: {
        title: 'Bar Chart Mix Title',
        barChart: {
            data: [
                {
                    name: 'Page A',
                    uv: 4000,
                    pv: 2400,
                    amt: 2400,
                    az: 50000,
                },
                {
                    name: 'Page B',
                    uv: 3000,
                    pv: 1398,
                    amt: 2210,
                    az: 50000,
                },
                {
                    name: 'Page C',
                    uv: 2000,
                    pv: 9800,
                    amt: 2290,
                    az: 50000,
                },
                {
                    name: 'Page D',
                    uv: 2780,
                    pv: 3908,
                    amt: 2000,
                    az: 50000,
                },
                {
                    name: 'Page E',
                    uv: 1890,
                    pv: 4800,
                    amt: 2181,
                    az: 50000,
                },
                {
                    name: 'Page F',
                    uv: 2390,
                    pv: 3800,
                    amt: 2500,
                    az: 50000,
                },
                {
                    name: 'Page G',
                    uv: 3490,
                    pv: 4300,
                    amt: 2100,
                    az: 50000,
                },
            ],
            labels: [
                { key: 'uv', fill: '#9c44dc', stackId: 'a', activeBar: { type: 'rectangle', fill: '#bc8ae1', stroke: '#442c61', } },
                { key: 'pv', fill: '#002060', stackId: 'a', activeBar: { type: 'rectangle', fill: '#FF9933', stroke: '#3b82f6' } },
                { key: 'amt', fill: '#F88104', activeBar: { type: 'rectangle', fill: '#FF6200', stroke: '#004387' } },
            ]
        }
    }
}

export const BarChartWithMinHeight: Story = {
    args: {
        title: 'Bar Chart With Min Height',
        barChart: {
            data,
            labels: [
                { key: 'uv', fill: '#9c44dc', minPointSize: 5, labelList: { dataKey: 'name', withContent: true } },
                { key: 'pv', fill: '#002060', minPointSize: 10 },
            ]
        }
    }
}

export const BarChartWithBackground: Story = {
    args: {
        title: 'Bar Chart Simple Title',
        barChart: {
            data,
            labels: [
                { key: 'uv', fill: '#9c44dc', background: {  fill: '#eee' } },
                { key: 'pv', fill: '#002060', activeBar: { type: 'rectangle', fill: '#FF9933', stroke: '#3b82f6' } },
                { key: 'amt', fill: '#F88104', activeBar: { type: 'rectangle', fill: '#FF6200', stroke: '#004387' } },
            ]
        }

    }
}

export const BarChartVertical: Story = {
    args: {
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
            layout: 'horizontal',
            labels: [{ key: 'value', fill: '#808080' }],
            withCurrencyTickFormatter: true
        }
    }
}