'use client'
import React from 'react';

import { Auth, useAlert, useLoading } from '@repo/ui';

import { generateUrlString } from '../../routes';
import { authService, setAccessToken } from '../../shared';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addAlert } = useAlert();
    const { show, hide } = useLoading()

    const redirectTo = searchParams.get('redirectTo') ?? undefined;

    const handeOnSubmit = async ( valid: boolean, email?: string, password?: string ) => {
        if(!valid) {
            addAlert({ type: 'error', message: 'Please fill in all required fields.' });
            return;
        }
        try {
            show();
            const response = await authService.signIn({ email: email ?? '', password: password ?? ''});
            setAccessToken(response);
            addAlert({ type: 'success', message: 'Authenticated successfully!' });
            router.replace(redirectTo ?? '/');
            window.location.reload();
        } catch (error: any) {
            const message =
                error?.statusCode !== 500 && error?.message
                    ? error.message
                    : 'Unable to authenticate at this time, please try again later';

            addAlert({ type: 'error', message });
            console.error(error)
        } finally {
            hide();
        }
    }
    return (
        <Auth
            type="sign-in"
            links={[
                {
                    order: 1,
                    title: 'Don\'t have an account ?',
                    context: 'primary',
                    children: 'Register here',
                    onClick: () => router.push(generateUrlString({ destination: '/sign-up', searchParams })),
                },
                {
                    order: 2,
                    children: 'I forgot my password',
                    context: 'primary',
                    onClick: () => router.push(generateUrlString({ destination: '/forgot-password', searchParams })),
                },
            ]}
            onSubmit={({ valid, fields: { email, password }}) => handeOnSubmit(valid, email, password)}
            description="By continuing, you affirm that you are over 18 years old and allow the sharing of your data in interactions with the platform."

        />
    )
}