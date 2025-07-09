import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { Button } from './Button';

const meta = {
    tags: ['autodocs'],
    args: {
        size: 'medium',
        weight: 'regular',
        context: 'primary',
        children: 'Hello, World!',
        appearance: 'standard',
        onClick: fn()
    },
    title: 'Components/Button',
    component: Button,
    parameters: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
    args: {},
};