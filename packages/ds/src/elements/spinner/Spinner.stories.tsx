import type { Meta, StoryObj } from '@storybook/react-vite';

import { OContext } from '../../utils';

import Spinner from './Spinner';

const meta = {
    tags: ['autodocs'],
    args: {
        size: 32,
        context: 'primary',
    },
    title: 'Elements/Spinner',
    argTypes: {
        size: {
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '32' },
            },
            control: { type: 'range', min: 16, max: 300 },
        },
        context: {
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'primary' },
            },
            options: OContext,
            control: { type: 'select' },
        },
    },
    component: Spinner,
    parameters: {},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {  args: {} };