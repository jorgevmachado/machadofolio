'use client'
import React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { EGender } from '@repo/services';

import { Auth, useAlert, useLoading } from '@repo/ui';

import {  generateUrlString } from '../../../routes';
import { authService, financeService, setAccessToken } from '../../shared';


type OnSubmitParams = {
    valid: boolean;
    fields: {
        cpf?: string;
        name?: string;
        email?: string;
        gender?: string;
        avatar?: string;
        whatsapp?: string;
        password?: string;
        date_of_birth?: string;
        password_confirmation?: string;
    }
}

export default function SignUpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addAlert } = useAlert();
    const { show, hide } = useLoading()

    const handleOnSubmit = async (params: OnSubmitParams) => {
        const { valid, fields } = params;
        // if(!valid) {
        //     addAlert({ type: 'error', message: 'Please fill in all required fields.' });
        //     return;
        // }
        try {
            show()
            const cpf = fields?.cpf?.replace(/\D/g, '') ?? '';
            const whatsapp = fields?.whatsapp?.replace(/\D/g, '') ?? '';

            const response = await authService.signUp({
                cpf,
                name: fields?.name ?? '',
                email: fields?.email ?? '',
                gender: fields?.gender as EGender,
                whatsapp,
                password: fields?.password ?? '',
                date_of_birth: new Date(fields?.date_of_birth ?? ''),
                password_confirmation: fields?.password_confirmation ?? '',
            })
            if(response) {
               const authResponse = await authService.signIn({ email: fields?.email ?? '', password: fields?.password ?? ''});
               console.log('# => handleOnSubmit => authResponse => ', authResponse);
               setAccessToken(authResponse);
                await authService.upload(fields.avatar as unknown as File)
                await financeService.initialize()
            }

            addAlert({ type: 'success', message: 'User created successfully!' });
            router.push(generateUrlString({ destination: '/', searchParams }));
        } catch (error: any) {
            const message =
                error?.statusCode !== 500 && error?.message
                    ? error.message
                    : 'Unable to create user at this time, please try again later';

            addAlert({ type: 'error', message });
        } finally {
            hide();
        }
        console.log('# => handleOnSubmit => fields => ', fields);
    }

    return (
        <Auth
            type="sign-up"
            links={[
                {
                    order: 1,
                    title: 'Already have an account ?',
                    context: 'primary',
                    children: 'Sign in here',
                    onClick: () => router.push(generateUrlString({ destination: '/sign-in', searchParams })),
                },
            ]}
            onSubmit={({valid, fields}) => handleOnSubmit({ valid, fields })}
            description="By creating an account, you agree to our Terms of Service and Privacy Policy."

        />
    )
}