import type { Meta, StoryObj } from '@storybook/react-vite';

import Chart from './Chart';

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'bar',
        data: [
            {
                type: 'bank',
                name: 'Nubank',
                value: 400,
                count: 4
            },
            {
                type: 'bank',
                name: 'Caixa',
                value: 300,
                count: 3
            },
            {
                type: 'bank',
                name: 'Itaú',
                value: 200,
                count: 2
            },
            {
                type: 'bank',
                name: 'Santander',
                value: 100,
                count: 1
            },
        ],
        title: 'Chart Title',
        subtitle: 'Chart Subtitle',
        wrapperType: 'default',
    },
    title: 'Components/Chart',
    argTypes: {},
    component: Chart,
    parameters: {},
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };

export const WrapperCard: Story = {
    args: {
        wrapperType: 'card'
    }
}

export const WithFallback: Story = {
    args: {
        data: [],
        fallback: 'Never to late',
    }
};

export const ChartBarHorizontal: Story = {
    args: {
        data: [
            {
                type: 'organic',
                name: 'Total',
                value: 5000,
                fill: '#8b5cf6'
            },
            {
                type: 'organic',
                name: 'Pago',
                value: 2500,
                fill: '#10b981'
            },
            {
                type: 'organic',
                name: 'Pendente',
                value: 2500,
                fill: '#ef4444'
            }
        ],
        layoutType: 'vertical'
    }
}

export const ChartPie: Story = {
    args: {
        type: 'pie',
        data: [
            {
                name: 'Fixed',
                value: 100,
                count: 1,
                type: 'organic',
                percentageTotal: 350
            },
            {
                name: 'Variable',
                value: 250,
                count: 3,
                type: 'organic',
                percentageTotal: 350
            },
        ],
    }
}