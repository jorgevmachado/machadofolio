import React from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { EGender } from '@repo/services';

import { ERole, EStatus } from '@repo/business';

import { type AuthForm } from '../../components';

import Auth from './Auth';

type AuthProps = React.ComponentProps<typeof Auth>;


const meta = {
    tags: ['autodocs'],
    args: {
        type: 'blank',
        logo: {
            src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHN5dygQnJFirBww40JLAsLuZHF0kOdBrzLw&s',
            onClick: fn(),
        },
    },
    title: 'Layout/Auth',
    argTypes: {},
    component: Auth,
    parameters: {},
} satisfies Meta<typeof Auth>;

export default meta;
type Story = StoryObj<typeof meta>;

const  Template = (args: AuthProps) => {
    const [authForm, setAuthForm] = React.useState<AuthForm | undefined>()
    return (
        <>
            <Auth {...args} onSubmit={(authForm) => setAuthForm(authForm)} />
            {authForm && <pre>{JSON.stringify(authForm, null, 2)}</pre>}
        </>
    )
}

export const SignUp: Story = {
    args: {
        type: 'sign-up',
        title: 'Create an Account',
        links: [
            {
                order: 1,
                title: 'Already have an account ?',
                children: 'Sign in here',
                context: 'primary',
                onClick: fn(),
            },
        ],
        infoText: 'Or register with your email',
        socialMedia: [
            {
                label: 'Sign in with Google',
                onClick: fn(),
                platform: 'google',
            },
            {
                label: 'Sign in with GitHub',
                onClick: fn(),
                platform: 'github',
            },
            {
                label: 'Sign in with Facebook',
                onClick: fn(),
                platform: 'facebook',
            }
        ],
        description: 'By creating an account, you agree to our Terms of Service and Privacy Policy.',
    },
    render: (args) => <Template {...args} />,
};

export const SignIn: Story = {
    args: {
        type: 'sign-in',
        title: 'Sign in',
        links: [
            {
                order: 3,
                children: 'I forgot my password',
                context: 'primary',
                onClick: fn(),
            },
            {
                order: 2,
                title: 'Already have an account ?',
                children: 'Sign in here',
                context: 'primary',
                onClick: fn(),
            },
            {
                order: 1,
                title: 'Don\'t have an account ?',
                children: 'Register here',
                context: 'primary',
                onClick: fn(),
            }
        ],
        infoText: 'Or sign in with your email',
        socialMedia: [
            {
                label: 'Sign up with Google',
                onClick: fn(),
                platform: 'google',
            },
            {
                label: 'Sign up with GitHub',
                onClick: fn(),
                platform: 'github',
            },
            {
                label: 'Sign up with Facebook',
                onClick: fn(),
                platform: 'facebook',
            }
        ],
        description: 'By continuing, you affirm that you are over 18 years old and allow the sharing of your data in interactions with the platform.',
    },
    render: (args) => <Template {...args} />,
};

export const Update: Story = {
    args: {
        type: 'update',
        logo: undefined,
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
