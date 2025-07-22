import type { TRoute } from '@repo/ui';

export const publicRoutes: Array<TRoute> = [
    {
        key: 'sign-in',
        path: '/auth/sign-in',
        type: 'public',
        title: 'Sign In',
    },
    {
        key: 'sign-up',
        path: '/auth/sign-up',
        type: 'public',
        title: 'Sign Up',
    },
    {
        key: 'forgot-password',
        path: '/auth/forgot-password',
        type: 'public',
        title: 'Forgot Password',
    },
    {
        key: 'reset-password',
        path: '/auth/reset-password',
        type: 'public',
        title: 'Reset Password',
    },
];

export const privateRoutes: Array<TRoute> = [
    {
        key: 'dashboard',
        icon: 'home',
        path: '/dashboard',
        type: 'private',
        title: 'Dashboard',
    },
    {
        key: 'profile',
        icon: 'user',
        path: '/profile',
        type: 'private',
        title: 'Profile',
    },
    {
        key: 'config',
        icon: 'config',
        path: '/config',
        type: 'private',
        title: 'Configuration',
    },
    {
        key: 'bank',
        icon: 'school',
        path: '/banks',
        type: 'private',
        title: 'Bank',
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
    {
        key: 'bill-parent',
        icon: 'wallet',
        path: '/bills',
        type: 'private',
        title: 'Bill',
        children: [
            {
                key: 'bill',
                icon: 'wallet',
                path: '',
                type: 'private',
                title: 'Bill',
            },
            {
                key: 'bill-category',
                path: '/categories',
                type: 'private',
                icon: 'category',
                title: 'Bill Category',
            },
        ],
    },
];

export const allRoutes: Array<TRoute> = [...publicRoutes, ...privateRoutes];