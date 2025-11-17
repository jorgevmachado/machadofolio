import type { Meta, StoryObj } from '@storybook/react-vite';

import Charts from './Charts';

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'bar',
        title: 'Super Chart Title',
        subtitle: 'Super Chart Subtitle',
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
        barChart: {
            data: [],
        }
    }
};