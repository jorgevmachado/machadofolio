import React, { useCallback, useEffect, useMemo } from 'react';

import type { ValidatorMessage, ValidatorParams } from '@repo/services';

import type { TUser } from '@repo/business';

import { type OnInputParams } from '@repo/ds';

import type { AuthForm, InputForm, InputFormProps, TForm } from './types';
import { FORMS, INPUTS } from './config';

type UseFormProps = Pick<React.HTMLProps<Element>, 'onInput'> & {
    user?: TUser;
    type: TForm;
    onSubmit?: (values: AuthForm) => void;
}

type TUseForm = {
    label: string;
    inputs: Array<InputForm>;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleOnInput: (params: OnInputParams) => void;
    handleValidator: (input: InputForm, params: ValidatorParams) => ValidatorMessage;
}

export function useForm({ user, type, onInput, onSubmit }: UseFormProps): TUseForm {
    const [currentForm, setCurrentForm] = React.useState<InputFormProps>({
        type,
        label: 'save',
        inputs: [],
    });
    const [inputs, setInputs] = React.useState<Array<InputForm>>([]);
    const [authForm, setAuthForm] = React.useState<AuthForm>({
        valid: true,
        fields: {
            cpf: undefined,
            name: undefined,
            email: undefined,
            gender: undefined,
            avatar: undefined,
            whatsapp: undefined,
            password: undefined,
            date_of_birth: undefined,
            password_confirmation: undefined
        },
        errors: {
            cpf: undefined,
            name: undefined,
            email: undefined,
            gender: undefined,
            avatar: undefined,
            whatsapp: undefined,
            password: undefined,
            date_of_birth: undefined,
            password_confirmation: undefined
        },
        message: undefined,
    });

    const handleValue = useCallback((input: InputForm, user?: TUser) => {
        if(!user) {
            return '';
        }

        if (input.id === 'date_of_birth' && Boolean(user?.date_of_birth)) {
            return user?.date_of_birth.toISOString();
        }

        return user?.[input.id as keyof TUser] as string;
    },[]);

    const isDisabled = useCallback(({ id }: InputForm) => {
        return type === 'update' && (id === 'cpf' || id === 'email' || id === 'whatsapp');
    }, [type]);

    const initializeInputs = useCallback((inputIds: Array<string>) => {
        const filteredInputs = INPUTS
            .filter((input) => inputIds.includes(input.id as string))
            .map((input) => ({ ...input, disabled: isDisabled(input), value: handleValue(input, user) }));

        setInputs(filteredInputs);

        const initialAccumulator = {
            fields: { ...authForm.fields},
            errors: { ...authForm.errors }
        }
        const { fields, errors } = filteredInputs.reduce((acc, input) => {
            acc.fields[input.id as keyof AuthForm['fields']] = input?.value as string  ?? '';
            acc.errors[input.id as keyof AuthForm['errors']] = undefined;

            if(input.validator && type === 'update') {
                acc.errors[input.id as keyof AuthForm['errors']] = input?.validator({
                    value: (acc.fields as AuthForm['fields'])[input.name as keyof AuthForm['fields']]
                });
            }
            return acc;
        }, initialAccumulator);

        setAuthForm((prev) => ({...prev, fields, errors }));

    }, [authForm, handleValue, user, type])

    const handleValidatorForm = useCallback(() => {
        const authFormDraft = { ...authForm };

        const { valid, errors, messages, updatedInputs } = inputs.reduce((acc, input) => {
            const value = authFormDraft.fields[input.id as keyof AuthForm['fields']];
            const validatorMessage = input.id === 'password_confirmation'
                ? input.validator({ value, optionalValue: authFormDraft.fields.password })
                : input.validator({ value });

            const inputValid = validatorMessage?.valid;
            const message = `${input.label}: ${validatorMessage.message}`;
            input.validated = { invalid: !inputValid, message };

            if(!inputValid) {
                acc.valid = false;
                acc.messages.push(message);
            }
            acc.errors[input.id as keyof AuthForm['errors']] = validatorMessage;
            acc.updatedInputs.push(input);
            return acc;
        }, {
            valid: true,
            errors: { ...authFormDraft.errors },
            messages: [] as Array<string>,
            updatedInputs: [] as Array<InputForm>,
        });

        authFormDraft.valid = valid;
        authFormDraft.errors = errors;
        authFormDraft.message = messages
            .map((message) => `   ${message}`)
            .join('\n');
        setAuthForm(authFormDraft);
        setInputs(updatedInputs);
    },[authForm, inputs]);

    const cleanFields = (fields: AuthForm['fields']) => {
        const data = {...fields};
        if(data.cpf) {
            data.cpf = data.cpf.replace(/\D/g, '');
        }
        if(data.whatsapp) {
            data.whatsapp = data.whatsapp.replace(/\D/g, '');
        }
        return data;
    }

    const handleAuthFormData = useCallback(() => {
        setAuthForm((prev) => {
            const formData = new FormData();
            Object.entries(prev.fields).forEach(([key, value]) => {
                if(value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });
            return { ...prev, formData };
        });
    }, []);

    const handleOnInput = useCallback(
        ({ name, value, event }: OnInputParams) => {
            setAuthForm((prev) => ({
                ...prev,
                fields: { ...prev.fields, [name]: value }
            }));
            if(onInput) {
                onInput(event);
            }
        }, [onInput]);

    const handleValidator = useCallback((input: InputForm, params: ValidatorParams) => {
        if(input.id === 'password_confirmation') {
            return input.validator({
                value: params.value,
                optionalValue: authForm.fields?.password
            })
        }
        return input.validator(params);
    }, [authForm]);

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleValidatorForm();
        handleAuthFormData();
        if(onSubmit) {
            const fields = cleanFields(authForm.fields);
            onSubmit({...authForm, fields });
        }
    }, [authForm, handleAuthFormData, handleValidatorForm, onSubmit]);


    useEffect(() => {
        const form = FORMS.find((form) => form.type === type);
        if(form) {
            setCurrentForm(form);
            initializeInputs(form.inputs);
        }
    }, [type]);

    return useMemo(() => ({
        label: currentForm?.label,
        inputs,
        handleSubmit,
        handleOnInput,
        handleValidator
    }), [currentForm?.label, handleOnInput, handleSubmit, handleValidator, inputs])
}