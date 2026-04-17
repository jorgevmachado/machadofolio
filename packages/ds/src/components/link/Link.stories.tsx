import type { Meta, StoryObj } from '@storybook/react-vite';

import { OContext, OSimplySize, OWeight } from '../../utils';

import Link from './Link';


const meta = {
    tags: ['autodocs'],
    args: {
        icon: undefined,
        size: 'medium',
        weight: 'regular',
        context: 'neutral',
        children: 'Hello, World!',
        notification: undefined,
    },
    title: 'Components/Link',
    argTypes: {
        size: {
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'regular' },
            },
            options: OSimplySize,
            control: { type: 'radio' },
        },
        weight: {
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'regular' },
            },
            options: OWeight,
            control: { type: 'radio' },
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
    component: Link,
    parameters: {},
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: { icon: { icon: 'react' }, notification: { counter: 2 } } };