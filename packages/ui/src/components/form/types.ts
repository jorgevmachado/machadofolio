import type React from 'react';

import { type Input } from '@repo/ds';

import { type ValidatorMessage, type ValidatorParams } from '@repo/services/index';


export type TForm = 'sign-up' | 'sign-in' | 'update' | 'forgot-password' | 'reset-password' | 'blank';

type TInput =
    | 'cpf'
    | 'name'
    | 'email'
    | 'gender'
    | 'avatar'
    | 'whatsapp'
    | 'password'
    | 'date_of_birth'
    | 'password_confirmation';

type InputFields = Record<TInput, string | undefined>;
type InputErrors = Record<TInput, ValidatorMessage | undefined>;

export type AuthForm = {
    valid: boolean;
    fields: InputFields;
    errors: InputErrors;
    message?: string;
    formData?: FormData;
}

export type InputFormProps = {
    type: TForm;
    label: string;
    inputs: Array<TInput>;
}

export type InputForm = Omit<React.ComponentProps<typeof Input>, 'validator'> & {
    validator: (validatorParams: ValidatorParams) => ValidatorMessage;
};