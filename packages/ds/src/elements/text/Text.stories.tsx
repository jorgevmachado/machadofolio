import type { Meta, StoryObj } from '@storybook/react-vite';

import Text from './Text';

const meta = {
    tags: ['autodocs'],
    args: {
        tag: 'p',
        color: 'neutral-80',
        weight: 'regular',
        variant: 'regular',
        htmlFor: undefined,
        children: 'Hello World!',
    },
    title: 'Elements/Text',
    argTypes: {
        tag: {
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'p' },
            },
            options: ['p', 'span', 'label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            control: { type: 'select' },
            description: 'Tag HTML element example: p, h1, h2, h3, h4, h5, h6',
        },
    },
    component: Text,
    parameters: {},
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };

export const NextLine: Story = {
    args: {
        variant: 'large',
        children: 'Hello ++next line ++World',
    },
};

export const StrongPartText: Story = {
    args: {
        variant: 'large',
        children: 'Hello *strong* World',
    },
};

export const ItalicPartText: Story = {
    args: {
        variant: 'large',
        children: 'Hello _em_ World',
    },
};

export const LabelWithFor: Story = {
    args: {
        tag: 'label',
        htmlFor: 'input-id',
        children: 'Input Label',
    },
};