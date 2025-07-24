import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from '../button';

import Input from './Input';

const meta = {
    tags: ['autodocs'],
    args: {
        tip: '(tip)',
        type: 'text',
        label: 'Label',
        helperText: {
            value: 'Helper Text'
        },
        placeholder: 'Placeholder',
    },
    title: 'Components/Input',
    argTypes: {},
    component: Input,
    parameters: {},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {  args: {} };

export const InputDisabled: Story = {
    args: {
        label: 'Input Disabled',
        disabled: true,
        placeholder: 'Input Disabled Placeholder'
    }
};

export const InputError: Story = {
    args: {
        label: 'Input Error',
        validator: {
            invalid: true,
            message: 'Field is required',
        },
        helperText: {
            value: 'Input Error Helper Text'
        },
        placeholder: 'Input Error Placeholder',
    }
};

export const InputFile: Story = {
    args: {
        type: 'file',
        label: 'File',
        accept: '.pdf, .xlsx, image/*',
        placeholder: 'Select file',
        withPreview: true
    }
};

export const InputNumber: Story = {
    args: {
        type: 'number',
        label: 'Number',
        placeholder: 'Input Number'
    }
};

export const InputEmail: Story = {
    args: {
        type: 'email',
        label: 'E-Mail',
        placeholder: 'Input Email'
    }
};

export const InputPhone: Story = {
    args: {
        type: 'phone',
        label: 'Phone',
        placeholder: 'Input Phone'
    }
};

export const InputTextArea: Story = {
    args: {
        rows: 10,
        type: 'textarea',
        fluid: true,
        label: 'Text Area',
        placeholder: 'Input Text Area'
    }
};

export const InputPassword: Story = {
    args: {
        type: 'password',
        label: 'Password',
        placeholder: 'Input Password'
    }
};

export const InputPrepend: Story = {
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

export const InputIconLeft: Story = {
    args: {
        icon: {
            icon: 'react',
        },
        type: 'text',
        label: 'Input Icon Left',
        placeholder: 'Input Icon Left Placeholder'
    }
}

export const InputIconRight: Story = {
    args: {
        icon: {
            icon: 'react',
            position: 'right'
        },
        type: 'text',
        label: 'Input Icon Right',
        placeholder: 'Input Icon Right Placeholder'
    }
}

export const InputCounter: Story = {
    args: {
        label: 'Input Counter',
        counter: {
            value: '9+',
            color: 'primary-80'
        },
        children: <div data-children="counter">8</div>,
        placeholder: 'Input Counter Placeholder'
    },
};

export const InputAddon: Story = {
    args: {
        addon: {
            value: '0,00',
            color: 'primary-80'
        },
        label: 'Input Addon',
        children: <div data-children="addon">0,00</div>,
        placeholder: 'Input Addon Placeholder'
    },

};

export const InputAppend: Story = {
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

export const InputPrependAppend: Story = {
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