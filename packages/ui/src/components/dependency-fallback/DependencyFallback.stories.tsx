import type { Meta, StoryObj } from '@storybook/react-vite';

import DependencyFallback from './DependencyFallback';

const meta: Meta<typeof DependencyFallback> = {
    tags: ['autodocs'],
    args: {},
    title: 'Components/DependencyFallback',
    argTypes: {},
    component: DependencyFallback,
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

export const WithCustomResourceName: Story = {
    args: {
        resourceName: 'Custom Resource Name'
    }
};

export const WithCustomDependencyName: Story = {
    args: {
        dependencyName: 'Custom Dependency Name'
    }
};

export const WithCustomMessage: Story = {
    args: {
        message: {
            text: 'Custom Message',
            color: 'info-100',
            weight: 'bold',
            variant: 'xlarge'
        }
    }
};

export const WithButton: Story = {
    args: {
        button: {
            label: 'Custom Button'
        }
    }
};

