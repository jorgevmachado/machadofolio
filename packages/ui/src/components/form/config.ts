import {
    EGender,
    calculateMaxDate,
    confirmPasswordValidator,
    cpfFormatter,
    cpfValidator,
    dateOfBirthValidator,
    emailValidator,
    fileBase64Validator,
    genderValidator,
    mobileFormatter,
    mobileValidator,
    nameValidator,
    passwordValidator
} from '@repo/services';

import type { InputForm, InputFormProps } from './types';

export const FORMS: Array<InputFormProps> = [
    {
        type: 'sign-up',
        label: 'Sign Up',
        inputs: [
            'cpf',
            'name',
            'email',
            'gender',
            'whatsapp',
            'password',
            'date_of_birth',
            'password_confirmation',
        ],
    },
    {
        type: 'sign-in',
        label: 'Sign In',
        inputs: [
            'email',
            'password',
        ],
    },
    {
        type: 'update',
        label: 'Save',
        inputs: [
            'cpf',
            'name',
            'email',
            'gender',
            'avatar',
            'whatsapp',
            'date_of_birth',
        ],
    },
    {
        type: 'forgot-password',
        label: 'Send',
        inputs: ['email'],
    },
    {
        type: 'reset-password',
        label: 'Send',
        inputs: ['password', 'password_confirmation'],
    },
];

export const INPUTS: Array<InputForm> = [
    {
        id: 'avatar',
        type: 'file',
        name: 'avatar',
        label: 'Avatar',
        accept: 'image/*',
        validator: fileBase64Validator,
        withPreview: true,
        placeholder: 'Enter your Avatar',
    },
    {
        id: 'cpf',
        type: 'cpf',
        name: 'cpf',
        label: 'CPF',
        validator: cpfValidator,
        formatter: cpfFormatter,
        placeholder: 'Enter your CPF',
    },
    {
        id: 'name',
        type: 'text',
        name: 'name',
        label: 'Name',
        validator: nameValidator,
        placeholder: 'Enter your Fullname',
    },
    {
        id: 'email',
        type: 'email',
        name: 'email',
        label: 'Email',
        validator: emailValidator,
        placeholder: 'Enter your Email',
    },
    {
        id: 'gender',
        type: 'radio-group',
        name: 'gender',
        label: 'Gender',
        options: [
            { label: 'Male', value: EGender.MALE },
            { label: 'Female', value: EGender.FEMALE },
            { label: 'Other', value: EGender.OTHER },
        ],
        validator: genderValidator,
    },
    {
        id: 'whatsapp',
        type: 'phone',
        name: 'whatsapp',
        label: 'Whatsapp',
        validator: mobileValidator,
        formatter: mobileFormatter,
        placeholder: 'Enter your Whatsapp',
    },
    {
        id: 'date_of_birth',
        max: calculateMaxDate(new Date(), 18)?.toISOString(),
        type: 'date',
        name: 'date_of_birth',
        label: 'Date of Birth',
        validator: dateOfBirthValidator,
        placeholder: 'Enter your Date of birth',
    },
    {
        id: 'password',
        type: 'password',
        name: 'password',
        label: 'Password',
        validator: passwordValidator,
        placeholder: 'Enter your Password',
    },
    {
        id: 'password_confirmation',
        type: 'password',
        name: 'password_confirmation',
        label: 'Confirm Password',
        validator: confirmPasswordValidator,
        placeholder: 'Confirm your Password',
    },
];