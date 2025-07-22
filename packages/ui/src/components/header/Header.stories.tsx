import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import Header from './Header';

const meta: Meta<typeof Header> = {
    tags: ['autodocs'],
    args: {
        logo: {
            src: 'https://placehold.co/150',
            alt: 'logo',
            title: 'logo',
            width: 80,
            height: 60,
            onClick: fn(),
        },
        navbar: [
            {
                key: 'about',
                label: 'Page',
                onRedirect: fn(),
            },
            {
                key: 'options',
                label: 'Options',
                items: [
                    {
                        key: 'option1',
                        label: 'Option 1',
                        onRedirect: fn(),
                    },
                    {
                        key: 'option2',
                        label: 'Option 2',
                        onRedirect: fn(),
                    },
                ],
            },
            {
                key: 'help',
                label: 'Help',
                onRedirect: fn(),
            },
        ],
        context: 'primary',
        handleToggleMenu: fn(),
    },
    title: 'Components/Header',
    argTypes: {},
    component: Header,
    decorators: [
        (Story) => (
            <div style={{ height: '50vh', width: '100%' }}>
                <Story />
            </div>
        ),
    ],
    parameters: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };