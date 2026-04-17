import type { Meta, StoryObj } from '@storybook/react-vite';

import { OContext } from '../../utils';

import ProgressIndicator from './ProgressIndicator';

const meta = {
    tags: ['autodocs'],
    args: {
        total: 7,
        current: 3,
    },
    title: 'Elements/ProgressIndicator',
    argTypes: {
        total: {
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '7' },
            },
            control: { type: 'range', min: 0, max: 300 },
        },
        current: {
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '3' },
            },
            control: { type: 'range', min: 0, max: 300 },
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
    component: ProgressIndicator,
    parameters: {},
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };