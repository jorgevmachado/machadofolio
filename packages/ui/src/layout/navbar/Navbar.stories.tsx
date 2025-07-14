import type { Meta, StoryObj } from '@storybook/react-vite';

import Navbar from './Navbar';

const meta = {
    tags: ['autodocs'],
    args: {
        title: 'My App',
    },
    title: 'Layout/Navbar',
    argTypes: {},
    component: Navbar,
    parameters: {},
    decorators: [
        (Story) => (
            <div style={{ height: '25vh', width: '100%' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };