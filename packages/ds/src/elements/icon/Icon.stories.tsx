import type { Meta, StoryObj } from '@storybook/react-vite';

import { OColors } from '../../utils';

import { OIcon, OIconGroup } from './options';
import Icon from './Icon';

const meta = {
    tags: ['autodocs'],
    args: {
        icon: 'react',
        size: '3em',
        color: 'neutral-80'
    },
    title: 'Elements/Icon',
    argTypes: {
        icon: {
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'react' }
            },
            control: { type: 'select' },
            options: OIcon
        },
        size: {
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '1em' },
            },
        },
        color: {
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'neutral-80' },
            },
            options: OColors,
            control: { type: 'select' },
        },
        group: {
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'fa' }
            },
            control: { type: 'select' },
            options: OIconGroup
        },
        withDefault: {
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
            control: { type: 'boolean' },
        },
    },
    component: Icon,
    parameters: {},
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {  args: {} };