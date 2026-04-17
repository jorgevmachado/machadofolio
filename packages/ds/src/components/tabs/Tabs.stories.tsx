import type { Meta, StoryObj } from '@storybook/react-vite';

import Tabs from './Tabs';

const mockItems = [
    {
        title: 'Tab 1',
        children: 'Tab 1 Content',
    },
    {
        title: 'Tab 2',
        children: 'Tab 2 Content',
    },
    {
        title: 'Tab 3',
        children: 'Tab 3 Content',
    },
]

const meta = {
    tags: ['autodocs'],
    args: {
        fluid: false,
        items: mockItems,

    },
    title: 'Components/Tabs',
    argTypes: {},
    component: Tabs,
    parameters: {},
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };

export const Fluid: Story = {  args: { fluid: true } };