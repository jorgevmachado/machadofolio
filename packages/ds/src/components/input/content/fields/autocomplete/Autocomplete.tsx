import React, { useState, useRef, useEffect, useMemo } from 'react';
import { joinClass, type OptionsProps } from '../../../../../utils';
import { Icon } from '../../../../../elements';
import '../select/Select.scss';

type AutocompleteProps = {
    id: string;
    name?: string;
    value?: string;
    onInput?: (event: React.FormEvent<HTMLInputElement>, value?: string) => void;
    options?: Array<OptionsProps>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, value?: string ) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    filterFunction?: (input: string, option: OptionsProps) => boolean;
}

export default function Autocomplete({
    id,
    name = 'autocomplete',
    value,
    onInput,
    options = [],
    disabled,
    className,
    placeholder = 'Type to search...',
    onChange,
    filterFunction,
}: AutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(-1);
    const [inputValue, setInputValue] = useState(value ?? '');
    const [closing, setClosing] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value !== undefined && value !== inputValue) {
            setInputValue(value);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
                setFocused(-1);
            }
        }
        if (open && !disabled) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, disabled]);

    const filteredOptions = useMemo(() => {
        if (!inputValue) return options;
        if (filterFunction) {
            return options.filter(opt => filterFunction(inputValue, opt));
        }
        return options.filter(opt => opt.label.toLowerCase().includes(inputValue.toLowerCase()));
    }, [inputValue, options, filterFunction]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (disabled) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setOpen(true);
                setFocused((prev) => Math.min(prev + 1, filteredOptions.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setOpen(true);
                setFocused((prev) => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                if(open && focused >= 0 && filteredOptions[focused]) {
                    selectOption(filteredOptions[focused].value);
                    return;
                }
                setOpen((o) => !o);
                break;
            case 'Escape':
            case 'Tab':
                setOpen(false);
                setFocused(-1);
                break;
        }
    }

    const selectOption = (value: string) => {
        setInputValue(options.find(opt => opt.value === value)?.label || value);
        const event = {
            target: {
                value: value,
                name: name,
            }
        } as React.ChangeEvent<HTMLInputElement>;
        if (onChange) {
            onChange(event, value);
        }
        if(onInput) {
            onInput(event, value);
        }
        setClosing(true);
        setFocused(-1);
        setTimeout(() => {
            setOpen(false);
            setClosing(false);
        }, 200);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setOpen(true);
        setFocused(-1);
        if (onInput) {
            onInput(e, e.target.value);
        }
    }

    const handleOptionClick = (value: string) => {
        selectOption(value);
        if (inputRef.current) {
            inputRef.current.blur();
        }
    }

    return (
        <div className="ds-select" ref={wrapperRef} data-testid="ds-autocomplete">
            <div
                className={joinClass([
                    "ds-select__control",
                    open && "ds-select__control--open",
                    className
                ])}
                role="combobox"
                aria-label={inputValue || placeholder}
                aria-expanded={open}
                aria-controls={open ? `${id}-dropdown` : undefined}
                aria-disabled={disabled}
                aria-activedescendant={open && focused >= 0 ? `${id}-option-${focused}` : undefined}
            >
                <input
                    id={id}
                    name={name}
                    ref={inputRef}
                    className="ds-select__input"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-controls={open ? `${id}-dropdown` : undefined}
                    aria-activedescendant={open && focused >= 0 ? `${id}-option-${focused}` : undefined}
                    data-testid="ds-autocomplete-input"
                />
                <Icon icon="chevron-down" color="primary-80" size="20" className={joinClass(["ds-select__arrow", open && "ds-select__arrow--open"])} />
                {open || closing ? (
                    <ul
                        id={`${id}-dropdown`}
                        className={joinClass([
                            "ds-select__dropdown",
                            closing && "ds-select__dropdown--closing"
                        ])}
                        role="listbox"
                        aria-labelledby={id}
                    >
                        {filteredOptions.length === 0 ? (
                            <li className="ds-select__option ds-select__option--empty" role="option" tabIndex={-1}>
                                Nenhuma opção encontrada
                            </li>
                        ) : filteredOptions.map((option, idx) => (
                            <li
                                key={option.value}
                                id={`${id}-option-${idx}`}
                                className={joinClass([
                                    'ds-select__option',
                                    inputValue === option.label && 'ds-select__option--selected',
                                    focused === idx && 'ds-select__option--focused',
                                ])}
                                role="option"
                                aria-selected={inputValue === option.label}
                                tabIndex={-1}
                                onClick={() => handleOptionClick(option.value)}
                                onMouseEnter={() => setFocused(idx)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </div>
    );
}

