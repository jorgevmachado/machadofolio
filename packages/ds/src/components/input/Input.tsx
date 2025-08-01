import React, { useEffect, useState } from 'react';

import {
    type ValidatorMessage,
    type ValidatorParams,
    cpfValidator,
    emailValidator,
    passwordValidator,
    phoneValidator
} from '@repo/services';

import {
    type TAppearance,
    type TContext,
    type TInputType,
    type ValidatedProps,
    generateComponentId, joinClass
} from '../../utils';

import { type TGenericIconProps, Text } from '../../elements';

import Feedback from '../feedback';
import Label from '../label';

import Content from './content';
import { InputProvider } from './InputContext';

import './Input.scss';

type InputPropsItem = Pick<
    React.HTMLProps<Element>,
    'onBlur' |
    'onInput' |
    'onFocus' |
    'onChange' |
    'onKeyDown' |
    'onMouseDown'
>;

type HostProps = Omit<React.HTMLProps<HTMLDivElement>, keyof InputPropsItem>;

type TextProps = React.ComponentProps<typeof Text>;

type ContentProps = React.ComponentProps<typeof Content>;

interface InputProps extends InputPropsItem, HostProps {
    tip?: string;
    type: TInputType;
    icon?: TGenericIconProps;
    fluid?: boolean;
    addon?: TextProps;
    value?: string | Array<string>;
    label?: string;
    onOpen?: () => void;
    onClose?: () => void;
    options?: ContentProps['options'];
    counter?: TextProps;
    context?: TContext;
    calendar?: ContentProps['calendar'];
    formatter?: (value?: string) => string;
    validated?: ValidatedProps;
    validator?: (validatorParams: ValidatorParams) => ValidatorMessage;
    helperText?: TextProps;
    appearance?: TAppearance;
    withPreview?: boolean;
    defaultValidator?: boolean;
    defaultFormatter?: boolean;
}

export default function Input({
    id,
    tip,
    min,
    max,
    type = 'text',
    icon,
    rows = 10,
    value = '',
    fluid,
    addon,
    label,
    onOpen,
    accept,
    onBlur,
    onClose,
    onInput,
    onFocus,
    counter,
    options,
    context = 'primary',
    multiple,
    calendar,
    formatter,
    required,
    children,
    onChange,
    disabled = false,
    validated,
    validator,
    onKeyDown,
    className,
    autoFocus = false,
    maxLength,
    minLength,
    helperText,
    appearance = 'standard',
    onMouseDown,
    placeholder = '',
    withPreview = false,
    autoComplete,
    defaultValidator = true,
    defaultFormatter = true,
    ...props
}: InputProps) {
    const [inputValidated, setInputValidated] = useState<ValidatedProps>({ invalid: false, message: undefined });

    const componentId = id ?? generateComponentId('ds-input');
    const componentLabelId = `${componentId}-label`;

    const handleValidator = (value: string) => {
        const validatorMessage: ValidatorMessage = { valid: true, message: '' };
        if(!defaultValidator) {
            return  validator ? validator({ value }) : validatorMessage;
        }
        switch (type) {
            case 'cpf':
                return validator ? validator({ value }) : cpfValidator({ value });
            case 'phone':
                return validator ? validator({ value }) : phoneValidator({ value });
            case 'email':
                return validator ? validator({ value }) : emailValidator({ value });
            case 'password':
                return validator ? validator({ value }) : passwordValidator({ value });
            default:
                return validator ? validator({ value }) : validatorMessage;
        }
    }

    const handleOnBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if(onBlur) {
            onBlur(event);
        }
        if(required && !event.target?.value) {
            setInputValidated({
                invalid: true,
                message:  validated?.message ?? 'This field is required.'
            });
            return;
        }
        const validatorMessage = handleValidator(event.target.value);
        setInputValidated({
            invalid: !validatorMessage.valid,
            message: !validatorMessage.valid ? validatorMessage.message : undefined
        })
    }

    useEffect(() => {
        if(validated) {
            setInputValidated(validated);
        }
    }, [validated]);


    return (
        <div
            {...props}
            id={componentId}
            role="group"
            tabIndex={-1}
            className={joinClass(['ds-input', className])}
            data-testid="ds-input">
            {label && (
                <Label
                    id={componentLabelId}
                    tip={tip}
                    color={inputValidated.invalid ? 'error-80' : 'neutral-80'}
                    label={label}
                    className="ds-input__label"
                />
            )}

            <InputProvider value={children} addon={addon} counter={counter}>
                <Content
                    min={min}
                    max={max}
                    icon={icon}
                    type={type}
                    rows={rows}
                    value={value}
                    fluid={fluid}
                    onOpen={onOpen}
                    accept={accept}
                    onBlur={handleOnBlur}
                    onClose={onClose}
                    options={options}
                    invalid={inputValidated.invalid}
                    onInput={onInput}
                    onFocus={onFocus}
                    context={context}
                    multiple={multiple}
                    required={required}
                    disabled={disabled}
                    onChange={onChange}
                    calendar={calendar}
                    formatter={formatter}
                    onKeyDown={onKeyDown}
                    autoFocus={autoFocus}
                    maxLength={maxLength}
                    minLength={minLength}
                    appearance={appearance}
                    onMouseDown={onMouseDown}
                    placeholder={placeholder}
                    withPreview={withPreview}
                    autoComplete={autoComplete}
                    defaultFormatter={defaultFormatter}
                />
            </InputProvider>

            {(inputValidated.invalid && inputValidated.message) && (
                <Feedback id={`${componentId}-feedback`} context="error" className="ds-input__feedback" >
                    {inputValidated.message}
                </Feedback>
            )}

            {(helperText) && (
                <Text
                    {...helperText}
                    id={`${componentId}-helper-text`}
                    color={ helperText?.color ?? 'error-80'}
                    variant={ helperText?.variant ?? 'small'}
                    className={joinClass(['ds-input__helper-text', helperText?.className ?? ''])}
                >
                    {helperText.children}
                </Text>
            )}

        </div>
    )
};
