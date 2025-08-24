import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import Alert from './Alert';

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'info',
        children: 'Hello, World! Info Alert',
    },
    title: 'Components/Alert',
    argTypes: {},
    component: Alert,
    parameters: {},
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };

export const Info: Story = { args: {} };

export const CustomIcon: Story = {  args: { type: 'info', icon: 'lamp', children: 'Hello, World! Custom Icon Lamp Alert',} };

export const Error: Story = {  args: { type: 'error', children: 'Hello, World! Error Alert',} };

export const Warning: Story = {  args: { type: 'warning', children: 'Hello, World! Warning Alert', } };

export const Success: Story = {  args: { type: 'success',children: 'Hello, World! Success Alert', } };

export const WithLink: Story = {
    args: {
        type: 'info',
        children: 'Hello, World! Alert with Link',
        link: {
            label: 'Click me',
            onClick: () => fn()
        }
    }
};

export const WithClose: Story = {
    args: {
        type: 'info',
        children: 'Hello, World! Alert with Close',
        onClose: fn()
    }
};