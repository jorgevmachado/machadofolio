import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';

import Switch from './Switch';

type SwitchProps = React.ComponentProps<typeof Switch>;

const meta = {
    tags: ['autodocs'],
    args: {
        label: 'Example',
        checked: false,
        context: 'primary',
        onChange: undefined,
        disabled: undefined,
    },
    title: 'Components/Switch',
    argTypes: {},
    component: Switch,
    parameters: {},
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: SwitchProps) =>  {
    const [isChecked, setIsChecked] = useState<boolean>(Boolean(args?.checked));

    return (
        <div>
            <Switch
                {...args}
                checked={isChecked}
                onChange={(_, nextChecked) => {
                    setIsChecked(nextChecked);
                }}
            />
        </div>
    );
}

export const Default: Story = {
    args: { },
    render: (args) => <Template {...args} />,
};

export const Disabled: Story = {
    args: { disabled: true },
    render: (args) => <Template {...args} />,
};

export const WithAfterLabel: Story = {
    args: { label: 'First', labelAfter: 'Second' },
    render: (args) => <Template {...args} />,
};