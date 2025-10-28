import type { Meta, StoryObj } from '@storybook/react-vite';

import SuperChart from './SuperChart';

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'bar',
        title: 'Super Chart Title',
        subtitle: 'Super Chart Subtitle',
        children: 'Hello, World!',
    },
    title: 'Components/SuperChart',
    argTypes: {},
    component: SuperChart,
    parameters: {},
} satisfies Meta<typeof SuperChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        barChart: {
            data: [],
        }
    }
};