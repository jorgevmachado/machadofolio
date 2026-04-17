import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

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
        onLinkClick: fn(),
        isAuthenticated: false,
    },
    title: 'Layout/Page',
    argTypes: {},
    component: Page,
    parameters: {},
    decorators: [
        (Story) => (
            <div className="ui-page-storybook-preview" style={{ minHeight: '100vh', maxWidth: '100%'}}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };

export const Authenticated: Story = {
    args: {
        isAuthenticated: true
    }
};

export const AuthenticatedWithInternationalization: Story = {
    args: {
        isAuthenticated: true,
        internationalization: {
            lang: 'pt-BR'
        }
    }
};

export const WithNavbarAction: Story = {
    args: {
        navbarAction: {
            label: 'Action',
            onClick: fn()
        },
        isAuthenticated: true
    }
};