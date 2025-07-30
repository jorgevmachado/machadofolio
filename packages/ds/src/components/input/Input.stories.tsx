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
            children: 'Helper Text'
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
            children: 'Input Error Helper Text'
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
        withPreview: true,
        validator: {
            invalid: true,
            message: 'Field is required',
        },
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

export const InputDatePicker: Story = {
    args: {
        min: '1990-01-01',
        max: '1990-12-31',
        type: 'date',
        label: 'Date',
        value: '01-01-1990',
        calendar: {
            inline: false,
            todayButton: 'Today',
        },
        children: (<div style={{ color: "red" }} data-children="calendar">Don&#39;t forget to check the weather!</div>),
        placeholder: 'Input Date',
    }
}

export const InputTextArea: Story = {
    args: {
        rows: 10,
        value: `
            Mussum Ipsum, cacilds vidis litro abertis. Mauris nec dolor in eros commodo tempor.
            Aenean aliquam molestie leo,vitae iaculis nisl. Diuretics paradis num copo é motivis de denguis.
            Pellentesque nec nulla ligula.
            Donec gravida turpis a vulputate ultricies. Eu nunca mais boto a boca num copo de cachaça,
            agora eu só uso canudis! Interagi no mé, cursus quis, vehicula ac nisi.
            In elementis mé pra quem é amistosis quis leo.
            A ordem dos tratores não altera o pão duris. Praesent malesuada urna nisi, quis volutpat erat hendrerit non.
            Nam vulputate dapibus.
        `,
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
            icon: 'arrow-left',
        },
        type: 'text',
        label: 'Input Icon Left',
        placeholder: 'Input Icon Left Placeholder'
    }
}

export const InputIconRight: Story = {
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

export const InputCounter: Story = {
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

export const InputAddon: Story = {
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