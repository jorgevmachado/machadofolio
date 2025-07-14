import type { Meta, StoryObj } from '@storybook/react-vite';

import Sidebar from './Sidebar';

const meta = {
    tags: ['autodocs'],
    args: {
        menu: [
            {
                key: 'sign-in',
                icon: 'sign-in',
                path: '/sign-in',
                type: 'public',
                title: 'Sign In',
            },
            {
                key: 'sign-up',
                icon: 'book',
                path: '/sign-up',
                type: 'public',
                title: 'Sign Up',
            },
            {
                key: 'forgot-password',
                icon: 'key',
                path: '/forgot-password',
                type: 'public',
                title: 'Forgot Password',
            },
            {
                key: 'reset-password',
                icon: 'key',
                path: '/reset-password',
                type: 'public',
                title: 'Reset Password',
            },
            {
                key: 'supplier-parent',
                icon: 'user-tie',
                path: '/suppliers',
                type: 'private',
                title: 'Supplier',
                children: [
                    {
                        key: 'supplier',
                        icon: 'user-tie',
                        path: '',
                        type: 'private',
                        title: 'Supplier',
                    },
                    {
                        key: 'supplier-type',
                        path: '/types',
                        type: 'private',
                        icon: 'box',
                        title: 'Supplier Type',
                    },
                ],
            },
        ],
    },
    title: 'Layout/Sidebar',
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