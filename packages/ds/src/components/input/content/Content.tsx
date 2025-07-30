import React, { forwardRef, useEffect, useState } from 'react';

import type DatePicker from 'react-datepicker';

import { type TContext, generateComponentId, joinClass } from '../../../utils';

import type { TGenericIconProps } from '../../../elements';

import { useInput } from '../InputContext';

import Addon from './addon';
import DateInput from './date';
import FileInput from './file';
import Inside from './inside';

import './Content.scss';

type CalendarProps = React.ComponentProps<typeof DatePicker>;

interface ContentProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'value'> {
    icon?: TGenericIconProps;
    rows?: number;
    fluid?: boolean;
    value?: string;
    onOpen?: () => void;
    context: TContext;
    onClose?: () => void;
    calendar?: CalendarProps;
    invalid?: boolean;
    withPreview?: boolean;
}

const Content = forwardRef<HTMLInputElement | HTMLTextAreaElement, ContentProps>((
    {
        type,
        icon,
        rows = 10,
        fluid = false,
        value = '',
        accept,
        onInput,
        onOpen,
        context,
        onClose,
        invalid = false,
        calendar,
        onChange,
        disabled = false,
        withPreview = true,
        ...props
    },
    ref
) => {
    const { hasAddon, hasAppend, hasPrepend, hasIconElement } = useInput();
    const [currentInputValue, setCurrentInputValue] = useState<string>(value);
    const [typeInput, setTypeInput] = useState<string | undefined>(type);
    const [currentIcon, setCurrentIcon] = useState<TGenericIconProps | undefined>(icon);

    const isPassword = type === 'password';
    const isTextArea = typeInput === 'textarea';
    const isFile = typeInput === 'file';
    const isDate = typeInput === 'date';
    const isDefault = !isTextArea && !isFile && !isDate;

    const componentId = props.id ?? generateComponentId(`ds-input-${type}`);

    const handleInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        setCurrentInputValue(target.value);
        if(onInput) {
            onInput(e);
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

    const handleOnClickIcon = (e: React.MouseEvent<HTMLSpanElement>) => {
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

    const hasIconLeft = hasIconElement('left', currentIcon);
    const hasIconRight = hasIconElement('right', currentIcon);

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
            <div className="ds-input-content__wrapper">
                <Inside show={isDefault} icon={currentIcon} position="left"/>
                {isTextArea && (
                    <textarea
                        id={componentId}
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        rows={rows}
                        value={currentInputValue}
                        onInput={handleInput}
                        disabled={disabled}
                        className={classNameInputList}
                        {...props}
                    />
                )}
                {isFile && (
                    <FileInput
                        id={componentId}
                        value={currentInputValue}
                        accept={accept}
                        onChange={handleOnChange}
                        disabled={disabled}
                        context={context}
                        className={joinClass(defaultClassNameInputList)}
                        withPreview={withPreview}
                    />
                )}
                {isDate && (
                    <DateInput
                        {...calendar}
                        id={componentId}
                        min={props?.min}
                        max={props?.max}
                        icon={currentIcon}
                        value={currentInputValue}
                        onOpen={onOpen}
                        invalid={invalid}
                        onClose={onClose}
                        disabled={disabled}
                        onChange={handleOnChange}
                        className={classNameInputList}
                        placeholder={props?.placeholder}
                    />
                )}
                {isDefault && (
                    <input
                        id={componentId}
                        ref={ref as React.Ref<HTMLInputElement>}
                        type={typeInput}
                        value={currentInputValue}
                        onInput={handleInput}
                        onChange={handleOnChange}
                        disabled={disabled}
                        className={classNameInputList}
                        {...props}
                    />
                )}
                <Inside show={isDefault} icon={currentIcon} isPassword={isPassword} onClick={handleOnClickIcon} position="right"/>
            </div>
            <Addon show={isDefault} position="right"/>
        </div>
    )
});
Content.displayName = 'Content';

export default Content;