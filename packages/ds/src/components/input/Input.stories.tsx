import React from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { OInputTypes } from '../../utils';

import Button from '../button';

import Input from './Input';

type InputProps = React.ComponentProps<typeof Input>;

const meta = {
    tags: ['autodocs'],
    args: {
        tip: '(tip)',
        type: 'text',
        label: 'Label',
        inline: true,
        context: 'primary',
        required: true,
        helperText: { children: 'Helper Text' },
        placeholder: 'Placeholder',
        defaultFormatter: true,
    },
    title: 'Components/Input',
    argTypes: {
        icon: { control: 'object' },
        type: {
            control: { type: 'select' },
            options: OInputTypes
        },
        label: { control: 'text' },
        value: { control: 'text' },
        fluid: { control: 'boolean' },
        disabled: { control: 'boolean' },
        calendar: { control: 'object' },
        validated: { control: 'object' },
        helperText: { control: 'object' },
        placeholder: { control: 'text' },
        withPreview: { control: 'boolean' },
        defaultFormatter: { control: 'boolean' },
    },
    component: Input,
    parameters: {},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: InputProps) => {
    const [onInput, setOnInput] = React.useState<{ name: string; value: string | Array<string>;} | undefined>(undefined);
    return (
        <>
            <Input {...args} onInput={( { name, value}) =>setOnInput({name, value })} />
            {onInput && (
                <div style={{ marginTop: '1rem' }}>
                    <strong>On Input:</strong>
                    <pre>{JSON.stringify(onInput, null, 2)}</pre>
                </div>
            )}
        </>
    );
}

export const Default: Story = {
    args: {},
    render: (args) => <Template {...args} />,
};

export const Disabled: Story = {
    args: {
        label: 'Disabled',
        disabled: true,
        placeholder: 'Disabled Placeholder'
    },
    render: (args) => <Template {...args} />,
};

export const Error: Story = {
    args: {
        label: 'Error',
        validated: {
            invalid: true,
            message: 'Field is required',
        },
        helperText: { children: 'Helper Text' },
        placeholder: 'Error Placeholder',
    },
    render: (args) => <Template {...args} />,
};

export const File: Story = {
    args: {
        type: 'file',
        label: 'File',
        value: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHN5dygQnJFirBww40JLAsLuZHF0kOdBrzLw&s',
        accept: '.pdf, .xlsx, image/*',
        placeholder: 'Select file',
        withPreview: true,
        validated: {
            invalid: true,
            message: 'Field is required',
        },
    },
    render: (args) => <Template {...args} />,
};

export const DatePicker: Story = {
    args: {
        min: '2000-01-01',
        max: '2030-12-31',
        type: 'date',
        label: 'Date',
        value: new Date().toISOString(),
        calendar: {
            inline: false,
            todayButton: 'Today',
        },
        children: (<div style={{ color: "red" }} data-children="calendar">Don&#39;t forget to check the weather!</div>),
        placeholder: 'Date',
    },
    render: (args) => <Template {...args} />,
}

export const RadioGroup: Story = {
    args: {
        type: 'radio-group',
        label: 'Radio Group',
        value: 'natural-person',
        options: [
            { label: 'Natural Person', value: 'natural-person' },
            { label: 'Legal Entity', value: 'legal-entity' },
        ],
    },
    render: (args) => <Template {...args} />,
}

export const RadioGroupRange: Story = {
    args: {
        type: 'radio-group',
        label: 'Radio Group Range',
        value: '1',
        options: Array.from(new Array(9), (_, i) => ({
            value: `${i + 1}`,
            label: `${i + 1}`,
        })),
        appearance: 'range',
    },
    render: (args) => <Template {...args} />,
}

export const RadioGroupMultiple: Story = {
    args: {
        type: 'radio-group',
        value: ['option1'],
        multiple: true,
        context: 'primary',
        options: [
            {
                label: 'Option 1',
                value: 'option1',
            },
            {
                label: 'Option 2',
                value: 'option2',
            }
        ],
        appearance: 'standard',
    },
    render: (args) => <Template {...args} />,
}

export const CPF: Story = {
    args: {
        type: 'cpf',
        label: 'CPF',
        fluid: true,
        validated: {
            invalid: false,
            message: 'Please enter a valid cpf number.',
        },
        placeholder: 'Insert CPF',
    },
    render: (args) => <Template {...args} />,
}

export const Number: Story = {
    args: {
        type: 'number',
        label: 'Number',
        placeholder: 'Number'
    },
    render: (args) => <Template {...args} />,
};

export const Email: Story = {
    args: {
        type: 'email',
        label: 'E-Mail',
        placeholder: 'Email'
    },
    render: (args) => <Template {...args} />,
};

export const Phone: Story = {
    args: {
        type: 'phone',
        label: 'Phone',
        placeholder: 'Phone'
    },
    render: (args) => <Template {...args} />,
};

export const TextArea: Story = {
    args: {
        rows: 10,
        value: 'Lorem ipsum dolor sit amet.',
        type: 'textarea',
        fluid: true,
        label: 'Text Area',
        placeholder: 'Text Area'
    },
    render: (args) => <Template {...args} />,
};

export const Password: Story = {
    args: {
        type: 'password',
        label: 'Password',
        placeholder: 'Input Password'
    },
    render: (args) => <Template {...args} />,
};

export const Select: Story = {
    args: {
        type: 'select',
        name: 'select',
        label: 'Select',
        options: [
            {
                label: 'Option 1',
                value: 'option1',
            },
            {
                label: 'Option 2',
                value: 'option2',
            }
        ],
        placeholder: 'Input Select',
        helperText: undefined,
    },
    render: (args) => <Template {...args} />,
};

export const WithPrepend: Story = {
    args: {
        type: 'text',
        label: 'Input Prepend',
        children: (
            <Button size="small" context="neutral" data-children="prepend">
                prepend
            </Button>
        ),
        placeholder: 'Input Prepend Placeholder'
    },
    render: (args) => <Template {...args} />,
};

export const WithIconLeft: Story = {
    args: {
        icon: { icon: 'arrow-left'},
        type: 'text',
        label: 'Input Icon Left',
        placeholder: 'Input Icon Left Placeholder'
    },
    render: (args) => <Template {...args} />,
}

export const WithIconRight: Story = {
    args: {
        icon: {
            icon: 'arrow-right',
            position: 'right'
        },
        type: 'text',
        label: 'Input Icon Right',
        placeholder: 'Input Icon Right Placeholder'
    },
    render: (args) => <Template {...args} />,
}

export const WithCounter: Story = {
    args: {
        label: 'Input Counter',
        counter: {
            color: 'primary-80',
            children: '9+',
        },
        children: <div data-children="counter">8</div>,
        placeholder: 'Input Counter Placeholder'
    },
    render: (args) => <Template {...args} />,
};

export const WithAddon: Story = {
    args: {
        addon: {
            color: 'primary-80',
            children: '0,00',
        },
        label: 'Input Addon',
        children: <div data-children="addon">0,00</div>,
        placeholder: 'Input Addon Placeholder'
    },
    render: (args) => <Template {...args} />,
};

export const WithAppend: Story = {
    args: {
        label: 'Input Append',
        children: (
            <Button size="small" context="neutral" data-children="append">
                append
            </Button>
        ),
        placeholder: 'Input Append Placeholder',
    },
    render: (args) => <Template {...args} />,
};

export const WithPrependAndAppend: Story = {
    args: {
        label: 'Input Prepend and Append',
        placeholder: 'Input Prepend and Append Placeholder',
    },
    render: (args) => (
        <Template {...args}>
            <Button size="small" context="neutral" data-children="prepend">
                prepend
            </Button>
            <Button size="small" context="neutral" data-children="append">
                append
            </Button>
        </Template>
    )
};