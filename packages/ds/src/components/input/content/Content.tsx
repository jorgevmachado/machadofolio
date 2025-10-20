import React, { forwardRef, useEffect, useState } from 'react';

import { cleanFormatter, cpfFormatter, currencyFormatter, digitsToDecimalString, phoneFormatter } from '@repo/services';

import { type OptionsProps, type TAppearance, type TContext, generateComponentId, joinClass } from '../../../utils';

import type { TGenericIconProps } from '../../../elements';

import { useInput } from '../InputContext';

import { DateInput, FileInput, RadioGroupInput, SelectInput, type OnFileChangeParams } from './fields';
import Addon from './addon';
import Inside from './inside';

import './Content.scss';

type DateInputProps = React.ComponentProps<typeof DateInput>;

type SelectInputProps = React.ComponentProps<typeof SelectInput>;

export type OnFileInputChangeParams = OnFileChangeParams;

export type OnInputParams = {
    name: string;
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>;
    value: string | Array<string>;
    invalid: boolean;
}

interface ContentProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'value' | 'onInput' | 'autoComplete'> {
    icon?: TGenericIconProps;
    rows?: number;
    fluid?: boolean;
    value?: string | Array<string>;
    onOpen?: () => void;
    onInput?: (params: OnInputParams) => void;
    context: TContext;
    onClose?: () => void;
    invalid?: boolean;
    options?: Array<OptionsProps>;
    calendar?: DateInputProps;
    onRemove?: () => void;
    clearFile?: boolean;
    formatter?: (value?: string) => string;
    appearance: TAppearance;
    withPreview?: boolean;
    onChangeFile?:(params: OnFileInputChangeParams) => void;
    autoComplete?: boolean;
    fallbackLabel?: string;
    filterFunction?: (input: string, option: OptionsProps) => boolean;
    fallbackAction?: SelectInputProps['fallbackAction'];
    defaultFormatter?: boolean;
    showRemoveButton?: boolean;
}

const Content = forwardRef<HTMLInputElement | HTMLTextAreaElement, ContentProps>((
    {
        type,
        icon,
        rows = 10,
        name,
        fluid = false,
        value = '',
        accept,
        onInput,
        onOpen,
        onBlur,
        context,
        onClose,
        invalid = false,
        options = [],
        calendar,
        onChange,
        disabled = false,
        onRemove,
        clearFile,
        formatter,
        appearance,
        withPreview = true,
        onChangeFile,
        autoComplete = false,
        fallbackLabel,
        filterFunction,
        fallbackAction,
        defaultFormatter = true,
        showRemoveButton = false,
        ...props
    },
    ref
) => {
    const { hasAddon, hasAppend, hasPrepend, hasIconElement } = useInput();
    const [currentInputValue, setCurrentInputValue] = useState<string | Array<string>>(value);
    const [typeInput, setTypeInput] = useState<string | undefined>(type);
    const [currentIcon, setCurrentIcon] = useState<TGenericIconProps | undefined>(icon);

    const isPassword = type === 'password';
    const isTextArea = type === 'textarea';
    const isFile = type === 'file';
    const isDate = type === 'date';
    const isRadioGroup = type === 'radio-group';
    const isSelect = type === 'select';
    const isDefault = !isTextArea && !isFile && !isDate && !isRadioGroup && !isSelect;

    const componentId = props.id ?? generateComponentId(`ds-input-${type}`);

    const handleInputValue = (value: string = '') => {
        switch (type) {
            case 'money':
                return digitsToDecimalString(value);
            case 'cpf':
            case 'phone':
                return value.replace(/\D/g, '');
            default:
                return value;
        }
    }

    const handleInput = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        const rawValue = value || target.value;
        const currentValue = handleInputValue(rawValue);
        setCurrentInputValue(currentValue);
        if(onInput) {
            onInput({
                name: name || '',
                event,
                value: currentValue,
                invalid
            });
        }
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, value?: string) => {
        if(value) {
            setCurrentInputValue(value);
        }
        if(onChange) {
            onChange(e)
        }
    }

    const handleOnChangeFile = (params: OnFileInputChangeParams) => {
        if(value) {
            setCurrentInputValue(value);
        }
        if(onChange) {
            onChange(params.event)
        }
        if(onChangeFile) {
            onChangeFile(params);
        }
    }

    const handleOnClick = (e: React.MouseEvent<HTMLInputElement | HTMLSpanElement>, value?: string | Array<string>) => {
        e.preventDefault();
        e.stopPropagation();
        if(isPassword) {
            setTypeInput((prev) => (prev === 'password' ? 'text' : 'password'));
            setCurrentIcon((prev) => {
                if(prev?.icon === 'eye') {
                    return {
                        ...prev,
                        icon: 'eye-close',
                    }
                }
                return {
                    ...prev,
                    icon: 'eye'
                }
            });
        }
        if(isRadioGroup) {

            if(onInput) {
                onInput({
                    name: name || '',
                    value: value || '',
                    event: e as React.MouseEvent<HTMLInputElement>,
                    invalid,
                });
            }
            setCurrentInputValue(value || '');
        }
    }

    useEffect(() => {
        setCurrentInputValue(value || '');
    }, [value]);

    useEffect(() => {
        if(!currentIcon && typeInput === 'password') {
            setCurrentIcon({
                icon: 'eye',
                color: 'neutral-80',
                position: 'right',
            });
        }
        if(!currentIcon && typeInput === 'date') {
            setCurrentIcon({
                icon: 'calendar',
                color: 'neutral-80',
            })
        }
    }, [currentIcon, icon, typeInput]);

    useEffect(() => {
        if(type === 'cpf') {
            setTypeInput('text');
        }
    }, [type]);

    const hasIconLeft = hasIconElement('left', currentIcon);
    const hasIconRight = hasIconElement('right', currentIcon);

    const treatValue = (value?: string | Array<string>) => {
        const currentValue = Array.isArray(value) ? value[0] : value;
        if (currentValue === undefined || currentValue === null) {
            return '';
        }
        if(!defaultFormatter) {
            return formatter ? formatter(currentValue) : currentValue;
        }
        switch (type) {
            case 'cpf':
                return formatter ? formatter(currentValue) : cpfFormatter(currentValue);
            case 'phone':
                return formatter ? formatter(currentValue) : phoneFormatter(currentValue);
            case 'money':
                return formatter ? formatter(currentValue) : currencyFormatter(currentValue);
            default:
                return formatter ? formatter(currentValue) : currentValue;
        }
    }

    const handleOnBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (type) {
            case 'cpf':
            case 'phone':
                e.target.value = cleanFormatter(e.target.value);
                break;
            default:
                break;
        }
        if(onBlur) {
            onBlur(e);
        }
    }

    const contentWrapperClassNameList = joinClass([
        'ds-input-content__wrapper',
        fluid ? 'ds-input-content__wrapper--fluid': ''
    ]);

    const defaultClassNameInputList: Array<string> = [
        'ds-input-content__field',
        fluid ? 'ds-input-content__field--fluid' : '',
        disabled ? 'ds-input-content__field--disabled' : '',
        isTextArea ? 'ds-input-content__field--textarea' : '',
        isFile ? 'ds-input-content__field--file' : '',
        isDate ? 'ds-input-content__field--date' : '',
        invalid ? 'ds-input-content__field--error' : '',
    ];

    const classNameInputList = joinClass([
        ...defaultClassNameInputList,
        hasPrepend && 'ds-input-content__field--prepend',
        hasAppend && 'ds-input-content__field--append',
        (hasAddon && !hasAppend) && 'ds-input-content__field--addon',
        hasIconLeft && 'ds-input-content__field--icon-left',
        hasIconRight && 'ds-input-content__field--icon-right',
    ]);

    return (
        <div className="ds-input-content" data-testid="ds-input-content">
            <Addon show={isDefault} position="left"/>
            <div className={contentWrapperClassNameList}>
                <Inside show={isDefault} icon={currentIcon} position="left"/>
                {isTextArea && (
                    <textarea
                        id={componentId}
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        rows={rows}
                        name={name}
                        value={currentInputValue}
                        onBlur={handleOnBlur}
                        onInput={handleInput}
                        disabled={disabled}
                        className={classNameInputList}
                        {...props}
                    />
                )}
                {isRadioGroup && (
                    <RadioGroupInput
                        id={componentId}
                        name={name}
                        value={currentInputValue}
                        options={options}
                        onClick={handleOnClick}
                        context={context}
                        disabled={disabled}
                        appearance={appearance}
                        {...props}
                    />
                )}
                {isFile && (
                    <FileInput
                        id={componentId}
                        name={name}
                        value={currentInputValue}
                        accept={accept}
                        multiple={props.multiple}
                        onInput={handleInput}
                        context={context}
                        onChange={handleOnChangeFile}
                        disabled={disabled}
                        onRemove={onRemove}
                        clearFile={clearFile}
                        className={joinClass(defaultClassNameInputList)}
                        withPreview={withPreview}
                        showRemoveButton={showRemoveButton}
                    />
                )}
                {isDate && (
                    <DateInput
                        {...calendar}
                        id={componentId}
                        min={props?.min}
                        max={props?.max}
                        icon={currentIcon}
                        name={name}
                        value={currentInputValue}
                        onBlur={handleOnBlur}
                        onOpen={onOpen}
                        onInput={handleInput}
                        onClose={onClose}
                        disabled={disabled}
                        onChange={handleOnChange}
                        className={classNameInputList}
                        placeholder={props?.placeholder}
                    />
                )}
                {isSelect && (
                    <SelectInput
                        id={componentId}
                        name={name}
                        value={currentInputValue ? currentInputValue as string : ''}
                        onInput={handleInput}
                        options={options}
                        onChange={handleOnChange}
                        disabled={disabled}
                        className={joinClass(defaultClassNameInputList)}
                        placeholder={props?.placeholder}
                        autoComplete={autoComplete}
                        fallbackLabel={fallbackLabel}
                        fallbackAction={fallbackAction}
                        filterFunction={filterFunction}
                    />
                )}
                {isDefault && (
                    <input
                        id={componentId}
                        ref={ref as React.Ref<HTMLInputElement>}
                        type={typeInput}
                        name={name}
                        value={treatValue(currentInputValue)}
                        onBlur={handleOnBlur}
                        onInput={handleInput}
                        onChange={handleOnChange}
                        disabled={disabled}
                        className={classNameInputList}
                        data-testid="ds-input-content-field"
                        {...props}
                    />
                )}
                <Inside show={isDefault} icon={currentIcon} isPassword={isPassword} onClick={handleOnClick} position="right"/>
            </div>
            <Addon show={isDefault} position="right"/>
        </div>
    )
});
Content.displayName = 'Content';

export default Content;