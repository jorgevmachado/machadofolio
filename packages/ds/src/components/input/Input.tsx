import React, { useEffect, useState } from 'react';

import {
    EInputContentChildren,
    type TInputType,
    type ValidatorProps,
    generateComponentId,
    joinClass,
    useChildrenElements
} from '../../utils';

import { type TGenericIconProps, Text } from '../../elements';

import Feedback from '../feedback';
import Label from '../label';

import { Field } from './field';

import './Input.scss';
import Addon from './addon';
import Inside from './inside';

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

interface InputProps extends InputPropsItem, HostProps {
    tip?: string;
    type: TInputType;
    icon?: TGenericIconProps;
    fluid?: boolean;
    addon?: TextProps;
    value?: string;
    label?: string;
    inline?: boolean;
    counter?: TextProps;
    showIcon?: boolean;
    validator?: ValidatorProps;
    helperText?: TextProps;
    withPreview?: boolean;
}

export default function Input({
    id,
    tip,
    rows,
    icon,
    type = 'text',
    name,
    fluid,
    addon,
    label,
    value = '',
    accept,
    onBlur,
    onInput,
    onFocus,
    counter,
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
    ...props
}: InputProps) {
    const [currentInputValue, setCurrentInputValue] = useState<string>(value);
    const [inputValidator, setInputValidator] = useState<ValidatorProps>({ invalid: false, message: undefined });
    const [isInputMouseFocused, setIsInputMouseFocused] = useState<boolean>(false);
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const [typeInput, setTypeInput] = useState<TInputType | undefined>(type);

    const { getChildrenElement, childrenElements } = useChildrenElements(children);

    const componentId = id ?? generateComponentId('ds-input');

    const classNameList = joinClass(['ds-input', className]);

    const isFile = typeInput === 'file';
    const isDate = typeInput === 'date';

    const isPassword = typeInput === 'password';
    const toggleShowPassword = () => {
        setTypeInput((prev) => (prev === 'password' ? 'text' : 'password'));
    };

    const ariaAttributes = {
        'aria-invalid': inputValidator.invalid || undefined,
        'aria-disabled': disabled,
        'aria-labelledby': label ? `${componentId}-label` : undefined,
        'aria-describedby': helperText ? `${componentId}-helper-text` : undefined,
        'aria-placeholder': placeholder,
    };

    const createEventHandler = <E extends React.SyntheticEvent>(updater?: React.Dispatch<React.SetStateAction<boolean>>, callback?: (e: E, value?: string) => void) => (e: E, value?: string) => {
        if(updater) {
            updater(true);
        }
        if(callback) {
            callback(e, value);
        }
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, value?: string) => {
        if(value) {
            setCurrentInputValue(value);
            if(onChange) {
                onChange(e);
            }
        }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setIsInputMouseFocused(false);
        setIsInputFocused(false);

        if (required && !e.target.value.trim()) {
            setInputValidator({
                invalid: true,
                message: 'Fields is required'
            })
        }

        if(onBlur) {
            onBlur(e);
        }
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        setCurrentInputValue(target.value);
        onInput && onInput(e);
    };

    const isPrepend = Boolean(childrenElements[EInputContentChildren.PREPEND]);

    const hasIconLeft = Boolean(
        (icon && (!icon.position || icon.position === 'left')) ||
        getChildrenElement(EInputContentChildren.ICON_LEFT)
    );

    const hasIconRight = Boolean(
        (icon && icon.position === 'right') ||
        getChildrenElement(EInputContentChildren.ICON_RIGHT)
    );

    const hasCounter = Boolean(counter ?? getChildrenElement(EInputContentChildren.COUNTER));

    const isAppend = Boolean(childrenElements[EInputContentChildren.APPEND]);

    const hasAddon = Boolean(addon ?? getChildrenElement(EInputContentChildren.ADDON));

    const classNameInputList = joinClass([
        'ds-input__field',
        fluid && 'ds-input__field--fluid',
        isPrepend && 'ds-input__field--prepend',
        hasIconLeft && 'ds-input__field--icon-left',
        hasIconRight && 'ds-input__field--icon-right',
        isAppend && 'ds-input__field--append',
        hasAddon && !isAppend && 'ds-input__field--addon',
        hasCounter && !hasIconRight && 'ds-input__field--counter',
        disabled && 'ds-input__field--disabled',
        inputValidator.invalid && 'ds-input__field--error',
        isInputFocused && 'ds-input-content__field--focused',
        isInputMouseFocused && 'ds-input-content__field--mouse-focused',
    ]);

    useEffect(() => {
        setCurrentInputValue(value || '');
    }, [value]);

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
            className={classNameList}
            data-testid="ds-input">
            {label && (
                <Label
                    id={`${componentId}-label`}
                    tip={tip}
                    color={inputValidator.invalid ? 'error-80' : 'neutral-80'}
                    label={label}
                    className="ds-input__label"
                />
            )}

            {/*{isFile && (*/}
            {/*    <FileInput*/}
            {/*        id={`${componentId}-file-input`}*/}
            {/*        accept={accept}*/}
            {/*        disabled={disabled}*/}
            {/*        isInvalid={inputValidator.invalid}*/}
            {/*        withPreview={withPreview}*/}
            {/*        onChange={createEventHandler(setIsInputMouseFocused, handleOnChange)}*/}
            {/*    />*/}
            {/*)}*/}

            {/*{isDate && (*/}
            {/*    <DatePicker*/}
            {/*        id={`${componentId}-date-picker-input`}*/}
            {/*        icon={icon}*/}
            {/*        value={value}*/}
            {/*        inline={inline}*/}
            {/*        showIcon={showIcon}*/}
            {/*        isInvalid={inputValidator.invalid}*/}
            {/*        handleInputValidator={setInputValidator}*/}
            {/*    />*/}
            {/*)}*/}
            <div className="ds-input__content" data-testid="ds-input-content">
                <Addon position="left">{children}</Addon>
                <div className="ds-input__content--wrapper">
                    <Inside icon={icon} position="left">
                        {children}
                    </Inside>
                    <Field
                        type={type}
                        rows={rows}
                        name={name}
                        value={currentInputValue}
                        onBlur={handleBlur}
                        onInput={handleInput}
                        onFocus={createEventHandler(setIsInputFocused, onFocus)}
                        onChange={createEventHandler(setIsInputMouseFocused, onChange)}
                        disabled={disabled}
                        onKeyDown={createEventHandler(setIsInputMouseFocused, onKeyDown)}
                        className={classNameInputList}
                        maxLength={maxLength}
                        minLength={minLength}
                        autoFocus={autoFocus}
                        placeholder={placeholder}
                        onMouseDown={createEventHandler(setIsInputMouseFocused, onMouseDown)}
                        autoComplete={autoComplete}
                        {...ariaAttributes}
                    />
                    <Inside
                        icon={icon}
                        counter={counter}
                        position="right"
                        isPassword={isPassword}
                        toggleShowPassword={toggleShowPassword}>
                        {children}
                    </Inside>
                </div>
                <Addon position="right">{children}</Addon>
            </div>



            {/*{(!isFile) && (*/}
            {/*    <Content*/}
            {/*        icon={icon}*/}
            {/*        type={type}*/}
            {/*        rows={rows}*/}
            {/*        name={name}*/}
            {/*        value={currentInputValue}*/}
            {/*        addon={addon}*/}
            {/*        fluid={fluid}*/}
            {/*        onBlur={handleBlur}*/}
            {/*        counter={counter}*/}
            {/*        onInput={handleInput}*/}
            {/*        onFocus={createEventHandler(setIsInputFocused, onFocus)}*/}
            {/*        onChange={createEventHandler(setIsInputMouseFocused, onChange)}*/}
            {/*        disabled={disabled}*/}
            {/*        onKeyDown={createEventHandler(setIsInputMouseFocused, onKeyDown)}*/}
            {/*        className={classNameInputList}*/}
            {/*        isInvalid={inputValidator.invalid}*/}
            {/*        maxLength={maxLength}*/}
            {/*        minLength={minLength}*/}
            {/*        autoFocus={autoFocus}*/}
            {/*        placeholder={placeholder}*/}
            {/*        onMouseDown={createEventHandler(setIsInputMouseFocused, onMouseDown)}*/}
            {/*        autoComplete={autoComplete}*/}
            {/*        {...ariaAttributes}*/}
            {/*    >*/}
            {/*        {children}*/}
            {/*    </Content>    */}
            {/*)}*/}

            {(inputValidator.invalid && inputValidator.message) && (
                <Feedback id={`${componentId}-feedback`} context="error" className="ds-input__feedback" >
                    {inputValidator.message}
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
    );
};
