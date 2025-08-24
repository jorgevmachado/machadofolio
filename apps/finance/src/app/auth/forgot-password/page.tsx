'use client'
import React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Auth } from '@repo/ui';

import {  generateUrlString } from '../../../routes';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    return (
        <Auth
            type="forgot-password"
            links={[
                {
                    order: 1,
                    title: 'Already have an account ?',
                    context: 'primary',
                    children: 'Sign in here',
                    onClick: () => router.push(generateUrlString({ destination: '/sign-in', searchParams })),
                },
            ]}
            description="Enter your registered email address to reset your password."
        />
    )
}