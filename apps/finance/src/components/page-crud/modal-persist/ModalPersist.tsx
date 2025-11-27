'use client'
import React, { useState } from 'react';

import { Button, Input } from '@repo/ds';

import { currentValue } from '../../utils';
import { handleOnInputParams, PersistInputProps } from '../../types';

import './ModalPersist.scss';

type ModalPersistProps = {
    item?: unknown;
    inputs: Array<PersistInputProps>;
    onClose: () => void;
    onSubmit?: (item?: unknown) => void;
}

export default function ModalPersist({
    item,
    inputs,
    onClose,
    onSubmit
}: Readonly<ModalPersistProps>) {

    const [currentItem, setCurrentItem] = useState<unknown>(item);

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