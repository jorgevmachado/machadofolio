import type { TRoute } from '@repo/ui';

import { type ReadonlyURLSearchParams } from 'next/navigation';

export const publicRoutes: Array<TRoute> = [
    {
        key: 'sign-in',
        path: '/sign-in',
        type: 'public',
        title: 'Sign In',
    },
    {
        key: 'sign-up',
        path: '/sign-up',
        type: 'public',
        title: 'Sign Up',
    },
    {
        key: 'forgot-password',
        path: '/forgot-password',
        type: 'public',
        title: 'Forgot Password',
    },
    {
        key: 'reset-password',
        path: '/reset-password',
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
        key: 'systems-parent',
        icon: 'system',
        path: '/systems',
        type: 'private',
        title: 'Systems',
        children: [
            {
                key: 'finance',
                icon: 'wallet',
                path: '/finance',
                type: 'private',
                title: 'Finance',
            },
            {
                key: 'geek',
                icon: 'gamepad',
                path: '/geek',
                type: 'private',
                title: 'Geek',
            },
            {
                key: 'law',
                icon: 'law',
                path: '/law',
                type: 'private',
                title: 'Law',
            }
        ]
    },
];

export const allRoutes: Array<TRoute> = [...publicRoutes, ...privateRoutes];

type GenerateUrlParams = {
    error?: string;
    destination: string;
    searchParams: ReadonlyURLSearchParams;
}

export const generateUrl = ({ destination, searchParams }: GenerateUrlParams) => {
    const env = searchParams.get('env') ?? undefined;
    const source = searchParams.get('source') ?? undefined;
    const redirectTo = searchParams.get('redirectTo') ?? undefined;

    const hasRequiredParameters = Boolean(source)

    const currentDestination = hasRequiredParameters ? destination : '/dashboard';

    const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4003';

    const destinationUrl = new URL(convertUrl(currentDestination), currentUrl);
    if(env) {
        destinationUrl.searchParams.set('env', env);
    }
    if(source) {
        destinationUrl.searchParams.set('source', source);
    }
    if(redirectTo) {
        destinationUrl.searchParams.set('redirectTo', redirectTo);
    }

    return destinationUrl;
}

const convertUrl = (destination: string) => {
    const key = destination.startsWith('/') ? destination.slice(1) : destination;
    const route = publicRoutes.find(route => route.key === key);
    return !route ? destination : route.path;
}

export const generateUrlString = (params: GenerateUrlParams) => {
    const url = generateUrl(params);
    return url.toString();
}