import React from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { EGender } from '@repo/services';

import { ERole, EStatus } from '@repo/business';

import Form from './Form';

type FormProps = React.ComponentProps<typeof Form>;

const meta = {
    tags: ['autodocs'],
    args: {
        type: 'sign-up',
        context: 'primary',
        loading: false,
    },
    title: 'Components/Form',
    argTypes: {},
    component: Form,
    parameters: {},
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

const  Template = (args: FormProps) => {
    return (
        <>
            <Form {...args}/>
        </>
    )
}

export const SignUp: Story = {
    args: {},
    render: (args) => <Template {...args} />,
};

export const SignIn: Story = {
    args: {
        type: 'sign-in',
    },
    render: (args) => <Template {...args} />,
};

export const Update: Story = {
    args: {
        type: 'update',
        user: {
            id: 'eaca4c08-e62d-495a-ae1c-918199da8d52',
            cpf: '49892120450',
            role: ERole.USER,
            name: 'John Doe',
            email: 'john.doe@mail.com',
            status: EStatus.ACTIVE,
            gender: EGender.MALE,
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHN5dygQnJFirBww40JLAsLuZHF0kOdBrzLw&s',
            password: '$2a$10$5pv7wQmv3rnXyB9YMqgocOAicud4eH9FQcN8beudNS9WMb.sSE5WS',
            whatsapp: '11998765432',
            created_at: new Date('2024-09-09T00:00:00.000Z'),
            updated_at: new Date('2024-09-09T00:00:00.000Z'),
            date_of_birth: new Date('1990-01-01T00:00:00.000Z'),
        }
    },
    render: (args) => <Template {...args} />,
};

export const Blank: Story = {
    args: {
        type: 'blank',
    },
    render: (args) => <Template {...args} />,
};
