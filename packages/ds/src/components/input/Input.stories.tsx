import type { Meta, StoryObj } from '@storybook/react-vite';

import { OInputTypes } from '../../utils';

import Button from '../button';

import Input from './Input';

const meta = {
    tags: ['autodocs'],
    args: {
        tip: '(tip)',
        type: 'text',
        label: 'Label',
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

export const Default: Story = {  args: {} };

export const Disabled: Story = {
    args: {
        label: 'Disabled',
        disabled: true,
        placeholder: 'Disabled Placeholder'
    }
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
    }
};

export const File: Story = {
    args: {
        type: 'file',
        label: 'File',
        accept: '.pdf, .xlsx, image/*',
        placeholder: 'Select file',
        withPreview: true,
        validated: {
            invalid: true,
            message: 'Field is required',
        },
    }
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
    }
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
    }
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
    }
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
    }
}

export const CPF: Story = {
    args: {
        type: 'cpf',
        label: 'CPF',
        validated: {
            invalid: false,
            message: 'Please enter a valid cpf number.',
        },
        placeholder: 'Insert CPF',
    }
}

export const Number: Story = {
    args: {
        type: 'number',
        label: 'Number',
        placeholder: 'Number'
    }
};

export const Email: Story = {
    args: {
        type: 'email',
        label: 'E-Mail',
        placeholder: 'Email'
    }
};

export const Phone: Story = {
    args: {
        type: 'phone',
        label: 'Phone',
        placeholder: 'Phone'
    }
};

export const TextArea: Story = {
    args: {
        rows: 10,
        value: 'Lorem ipsum dolor sit amet.',
        type: 'textarea',
        fluid: true,
        label: 'Text Area',
        placeholder: 'Text Area'
    }
};

export const Password: Story = {
    args: {
        type: 'password',
        label: 'Password',
        placeholder: 'Input Password'
    }
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
    }
};

export const WithIconLeft: Story = {
    args: {
        icon: { icon: 'arrow-left'},
        type: 'text',
        label: 'Input Icon Left',
        placeholder: 'Input Icon Left Placeholder'
    }
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
    }
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
};

export const WithPrependAndAppend: Story = {
    args: {
        label: 'Input Prepend and Append',
        placeholder: 'Input Prepend and Append Placeholder',
    },
    render: (args) => (
        <Input {...args}>
            <Button size="small" context="neutral" data-children="prepend">
                prepend
            </Button>
            <Button size="small" context="neutral" data-children="append">
                append
            </Button>
        </Input>
    )
};