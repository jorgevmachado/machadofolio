import type { Meta, StoryObj } from '@storybook/react-vite';

import Content from './Content';

const meta = {
    tags: ['autodocs'],
    args: {
        title: 'Content',
        children: 'Hello, World!',
        isSidebarOpen: false,
        withAnimation: false,
    },
    title: 'Components/Content',
    argTypes: {},
    component: Content,
    parameters: {},
} satisfies Meta<typeof Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };