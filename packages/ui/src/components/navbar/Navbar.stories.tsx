import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import Navbar from './Navbar';

const meta = {
    tags: ['autodocs'],
    args: {
        title: 'My App',
    },
    title: 'Components/Navbar',
    argTypes: {},
    component: Navbar,
    parameters: {},
    decorators: [
        (Story) => (
            <div className="ui-navbar-storybook-preview" style={{ height: '100vh', width: '100%', maxWidth: 800 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };

export const WithAction: Story = {
    args: {
        action: {
            label: 'sign-in',
            onClick: fn()
        }
    }
};

export const WithUserName: Story = {
    args: {
        userName: 'John'
    }
};

export const WithInternationalization: Story = {
    args: {
        userName: 'John',
        internationalization: {
            lang: 'pt-BR'
        }
    }
}