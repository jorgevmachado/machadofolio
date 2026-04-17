import type { Meta, StoryObj } from '@storybook/react-vite';

import { menuMock } from '../../mocks';

import Sidebar from './Sidebar';

const meta = {
    tags: ['autodocs'],
    args: {
        menu: menuMock,
    },
    title: 'Components/Sidebar',
    argTypes: {},
    component: Sidebar,
    parameters: {},
    decorators: [
        (Story) => (
            <div style={{ height: '50vh', width: '100%' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };