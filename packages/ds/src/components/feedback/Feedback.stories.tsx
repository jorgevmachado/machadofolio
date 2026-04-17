import type { Meta, StoryObj } from '@storybook/react-vite';

import Feedback from './Feedback';

const meta = {
    tags: ['autodocs'],
    args: {
        id: 'feedback-storybook',
        context: 'error',
        children: 'Hello, World!',
    },
    title: 'Components/Feedback',
    argTypes: {},
    component: Feedback,
    parameters: {},
} satisfies Meta<typeof Feedback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };