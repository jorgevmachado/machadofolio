'use client'
import React, { useState } from 'react';

import { Button, Input, OnInputParams } from '@repo/ds';

import './ModalPersist.scss';


type InputProps = React.ComponentProps<typeof Input>;

type handleOnInputParams = OnInputParams & {
    type: InputProps['type'];
    list?: Array<unknown>;
}

type CurrentValueParams = {
    type: InputProps['type'];
    name?: string;
    item?: unknown;
}

type ModalPersistInputProps = Omit<InputProps, 'list'> & {
    list?: Array<unknown>;
}

type ModalPersistProps = {
    item?: unknown;
    inputs: Array<ModalPersistInputProps>;
    onClose: () => void;
    onSubmit?: (item?: unknown) => void;
}

export default function ModalPersist({
    item,
    inputs,
    onClose,
    onSubmit
}: ModalPersistProps) {

    const [currentItem, setCurrentItem] = useState<unknown | undefined>(item);

    const handleOnInput = ({ value, name, type, list = [] }: handleOnInputParams) => {
        if(type === 'select') {
            const currentValue = list?.find((item) => (item as { id?: string })?.id === value)
            setCurrentItem((prev: Record<string, unknown> = {}) => ({
                ...prev,
                [name]: currentValue
            }));
            return;
        }
        setCurrentItem((prev: Record<string, unknown> = {}) => ({
            ...prev,
            [name]: value
        }));

    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit?.(currentItem);
        onClose();
    };

    const currentValue = ({ name, type, item }: CurrentValueParams ): string => {
        if(item && name) {
            const currentValue = (item as Record<string, unknown>)[name]
            if(type === 'select') {
                return (currentValue as { id?: string })?.id ?? ''
            }
            return typeof currentValue === 'string' ? currentValue : String(currentValue ?? '');
        }
        return '';
    }

    return (
        <form className="modal-persist" onSubmit={handleSubmit}>
            <div className="modal-persist__inputs">
                {inputs?.map((input) => {
                    const { list, ...inputProps } = input;
                    return (
                        <Input
                            {...inputProps}
                            key={input.name}
                            value={currentValue({ name: input.name, item: currentItem, type: input.type })}
                            onInput={(params) => handleOnInput({...params, type: input.type, list})}
                        />
                    );
                })}
            </div>
            <div className="modal-persist__actions">
                <Button context="error" appearance="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" context="success">Save</Button>
            </div>
        </form>
    )
}