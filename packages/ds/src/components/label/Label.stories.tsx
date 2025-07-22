import type { Meta, StoryObj } from '@storybook/react-vite';

import Label from './Label';

const meta = {
    tags: ['autodocs'],
    args: {
        tag: 'label',
        tip: '(Tip)',
        label: 'Label',
        componentId: 'label',
    },
    title: 'Components/Label',
    argTypes: {},
    component: Label,
    parameters: {},
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };