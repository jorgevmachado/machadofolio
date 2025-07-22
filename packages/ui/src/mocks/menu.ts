import { type TRoute } from '../utils';

export const menuMock: Array<TRoute> = [
    {
        key: 'sign-in',
        icon: 'sign-in',
        path: '/sign-in',
        type: 'public',
        title: 'Sign In',
    },
    {
        key: 'sign-up',
        icon: 'book',
        path: '/sign-up',
        type: 'public',
        title: 'Sign Up',
    },
    {
        key: 'forgot-password',
        icon: 'key',
        path: '/forgot-password',
        type: 'public',
        title: 'Forgot Password',
    },
    {
        key: 'reset-password',
        icon: 'key',
        path: '/reset-password',
        type: 'public',
        title: 'Reset Password',
    },
    {
        key: 'supplier-parent',
        icon: 'user-tie',
        path: '/suppliers',
        type: 'private',
        title: 'Supplier',
        children: [
            {
                key: 'supplier',
                icon: 'user-tie',
                path: '',
                type: 'private',
                title: 'Supplier',
                children: [{
                    key: 'supplier-son',
                    icon: 'user-tie',
                    path: '',
                    type: 'private',
                    title: 'Supplier Son',
                }]
            },
            {
                key: 'supplier-type',
                path: '/types',
                type: 'private',
                icon: 'box',
                title: 'Supplier Type',
            },
        ],
    },
];