import React from 'react';

import type { TUser } from '@repo/business';

import { Button, Input, type TContext } from '@repo/ds';

import type { AuthForm, TForm } from './types';
import { useForm } from './useForm';

import './Form.scss'

interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
    user?: TUser;
    type: TForm;
    context?: TContext;
    loading?: boolean;
    onSubmit?: (values: AuthForm) => void;
}

export default function Form({
    user,
    type,
    context,
    onInput,
    loading = false,
    onSubmit,
    ...props
}: FormProps) {
    const { inputs, label, handleSubmit, handleOnInput, handleValidator } = useForm({ type, user, onInput, onSubmit });

    if( type === 'blank') {
        return null;
    }

    return (
        <form
            {...props}
            id={`form-${type}`}
            onSubmit={handleSubmit}
            className="ui-form"
            data-testid={`ui-form-${type}`}>
            {inputs?.map((input, index) => (
                <div
                    key={`ui-form-input-${input.id}-${index}`}
                    className={`ui-form__input ui-form__input--${input.id}`}
                    data-testid={`ui-form-input-${input.id}`}
                >
                    <Input
                        {...input}
                        fluid
                        onInput={handleOnInput}
                        context={context}
                        validator={(params) => handleValidator(input, params)}
                        data-testid={`ui-form-input-${input.id}-field`}
                    />
                </div>
            ))}
            <Button type="submit"  context={context} fluid loading={{ value: loading }}>{label}</Button>
        </form>
    )
}