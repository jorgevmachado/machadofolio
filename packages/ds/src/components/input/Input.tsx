import React, { useEffect, useState } from 'react';

import type DatePicker from 'react-datepicker';

import {
    type TContext,
    type TInputType,
    type ValidatorProps,
    generateComponentId,
    joinClass
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

type CalendarProps = React.ComponentProps<typeof DatePicker>;

interface InputProps extends InputPropsItem, HostProps {
    tip?: string;
    type: TInputType;
    icon?: TGenericIconProps;
    fluid?: boolean;
    addon?: TextProps;
    value?: string;
    label?: string;
    onOpen?: () => void;
    onClose?: () => void;
    counter?: TextProps;
    context?: TContext;
    calendar?: CalendarProps;
    formatter?: (value?: string) => string;
    validator?: ValidatorProps;
    helperText?: TextProps;
    withPreview?: boolean;
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
    context = 'primary',
    calendar,
    formatter,
    required,
    children,
    onChange,
    disabled = false,
    validator,
    onKeyDown,
    className,
    autoFocus = false,
    maxLength,
    minLength,
    helperText,
    onMouseDown,
    placeholder = '',
    withPreview = false,
    autoComplete,
    defaultFormatter = true,
    ...props
}: InputProps) {
    const [inputValidator, setInputValidator] = useState<ValidatorProps>({ invalid: false, message: undefined });

    const componentId = id ?? generateComponentId('ds-input');
    const componentLabelId = `${componentId}-label`;

    useEffect(() => {
        if(validator) {
            setInputValidator(validator);
        }
    }, [validator]);


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
                    color={inputValidator.invalid ? 'error-80' : 'neutral-80'}
                    label={label}
                    className="ds-input__label"
                />
            )}

            {(inputValidator.invalid && inputValidator.message) && (
                <Feedback id={`${componentId}-feedback`} context="error" className="ds-input__feedback" >
                    {inputValidator.message}
                </Feedback>
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
                    onBlur={onBlur}
                    onClose={onClose}
                    invalid={inputValidator.invalid}
                    onInput={onInput}
                    onFocus={onFocus}
                    context={context}
                    required={required}
                    disabled={disabled}
                    onChange={onChange}
                    calendar={calendar}
                    formatter={formatter}
                    onKeyDown={onKeyDown}
                    autoFocus={autoFocus}
                    maxLength={maxLength}
                    minLength={minLength}
                    onMouseDown={onMouseDown}
                    placeholder={placeholder}
                    withPreview={withPreview}
                    autoComplete={autoComplete}
                    defaultFormatter={defaultFormatter}
                />
            </InputProvider>

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
