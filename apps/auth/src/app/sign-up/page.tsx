'use client';
import React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { type EGender } from '@repo/services';

import { Auth ,type AuthForm ,useAlert ,useLoading } from '@repo/ui';

import { generateUrlString } from '../../routes';
import { authService, setAccessToken } from '../../shared';

const REQUIRED_FIELDS: Array<keyof AuthForm['fields']> = [
  'cpf',
  'name',
  'email',
  'gender',
  'whatsapp',
  'date_of_birth',
  'password',
  'password_confirmation'
];

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addAlert } = useAlert();
  const { show, hide } = useLoading();


  const hasFormValid = (fields: AuthForm['fields']) => {
    return REQUIRED_FIELDS.every(field => !!fields[field] && fields[field] !== '');
  };

  const handeOnSubmit = async ( valid: boolean, fields: AuthForm['fields'] ) => {
    if (!valid || !hasFormValid(fields)) {
      addAlert({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    try {
      show();
      const response = await authService.signUp({
        cpf: fields.cpf!,
        name: fields.name! ,
        date_of_birth: new Date(fields.date_of_birth!),
        email:fields.email!,
        gender: fields.gender! as EGender ,
        whatsapp: fields.whatsapp!,
        password: fields.password! ,
        password_confirmation: fields.password_confirmation! ,
      });
      setAccessToken(response);
      addAlert({ type: 'success', message: 'Registration Completed successfully!' });
      router.push(generateUrlString({ destination: '/sign-in', searchParams }));
    } catch (error: any) {
      const message =
        error?.statusCode !== 500 && error?.message
          ? error.message
          : 'Registration was unsuccessful; please try again later.';

      addAlert({ type: 'error', message });
      throw error;
    } finally {
      hide();
    }
  };
  return (
    <Auth
      type="sign-up"
      title="Create your account"
      links={[
        {
          order: 1,
          title: 'Already have an account ?',
          context: 'primary',
          children: 'Sign in here',
          onClick: () => router.push(generateUrlString({ destination: '/sign-in', searchParams })),
        },
      ]}
      onSubmit={({ valid, fields }) => handeOnSubmit(valid, fields)}
      description="By creating an account, you agree to our Terms of Service and Privacy Policy."

    />
  );
}