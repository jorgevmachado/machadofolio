import type { TRoute } from '@repo/ui';
import { ReadonlyURLSearchParams } from 'next/navigation';

export const publicRoutes: Array<TRoute> = [
    {
        key: 'sign-in',
        path: '/sign-in',
        type: 'public',
        name: 'sign_in',
        title: 'Sign In',
    },
    {
        key: 'sign-up',
        path: '/sign-up',
        type: 'public',
        name: 'sign_up',
        title: 'Sign Up',
    },
    {
        key: 'forgot-password',
        path: '/forgot-password',
        type: 'public',
        name: 'forgot_password',
        title: 'Forgot Password',
    },
    {
        key: 'reset-password',
        path: '/reset-password',
        type: 'public',
        name: 'reset_password',
        title: 'Reset Password',
    },
];

export const privateRoutes: Array<TRoute> = [
    {
        key: 'dashboard',
        icon: 'home',
        path: '/dashboard',
        type: 'private',
        name: 'dashboard',
        title: 'Dashboard',
    },
    {
        key: 'profile',
        icon: 'user',
        path: 'http://localhost:4001/profile?source=finance&redirectTo=http://localhost:4002/dashboard',
        type: 'private',
        name: 'profile',
        title: 'Profile',
    },
    {
        key: 'bank',
        icon: 'school',
        path: '/banks',
        type: 'private',
        name: 'bank',
        title: 'Bank',
    },
    {
        key: 'group',
        icon: 'group',
        path: '/groups',
        type: 'private',
        name: 'group',
        title: 'Group',
    },
    {
        key: 'supplier-parent',
        icon: 'user-tie',
        path: '/suppliers',
        type: 'private',
        name: 'supplier',
        title: 'Supplier',
        children: [
            {
                key: 'supplier',
                icon: 'user-tie',
                path: '',
                type: 'private',
                name: 'supplier',
                title: 'Supplier',
            },
            {
                key: 'supplier-type',
                path: '/types',
                type: 'private',
                icon: 'box',
                name: 'supplier_type',
                title: 'Supplier Type',
            },
        ],
    },
    {
        key: 'bill',
        icon: 'wallet',
        path: '/bills',
        type: 'private',
        name: 'bill',
        title: 'Bill',
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