import type { Meta, StoryObj } from '@storybook/react-vite';

import Logo from './Logo';

const meta = {
    tags: ['autodocs'],
    args: {
        alt: 'Logo Alt',
        title: 'Logo Title',
        width: 100,
        height: 100,
    },
    title: 'Components/Logo',
    argTypes: {},
    component: Logo,
    parameters: {},
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };