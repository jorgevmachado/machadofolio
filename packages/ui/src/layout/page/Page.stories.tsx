import type { Meta, StoryObj } from '@storybook/react-vite';

import { menuMock } from '../../mocks';

import Page from './Page';

const meta = {
    tags: ['autodocs'],
    args: {
        menu: menuMock,
        title: 'My App',
        children: 'Hello, World!',
        userName: 'Jorge Machado',
        navbarTitle: 'Finance App',
        isAuthenticated: false,
    },
    title: 'Layout/Page',
    argTypes: {},
    component: Page,
    parameters: {},
    decorators: [
        (Story) => (
            <div style={{ height: '45vh', width: '100%' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };