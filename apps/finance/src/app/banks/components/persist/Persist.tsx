import React from 'react';

import { Bank } from '@repo/business';

import { Button, Input, OnInputParams } from '@repo/ds';
import { nameValidator } from '@repo/services';
import { useAlert } from '@repo/ui';

type PersistProps = {
    bank?: Bank;
    onClose: () => void;
    onSubmit: (bank?: Bank) => void;
}
export default function Persist({
    bank,
    onClose,
    onSubmit
}: PersistProps) {
    const [item, setItem] = React.useState<Bank | undefined>(bank);
    const { addAlert } = useAlert();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>  {
        event.preventDefault();
        const { valid, message } = nameValidator({ value: item?.name || '' });
        if(!valid) {
            addAlert({ type: 'error', message: message });
            return;
        }
        onSubmit(item);
        console.log('# => handleSubmit => item => ', item);
    }

    const handleOnInput = ({ name, value }: OnInputParams) => {
        setItem((prev) => ({ ...prev, [name]: value} as Bank));
    }


    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Input
                    fluid
                    type="text"
                    name="name"
                    label="Bank"
                    value={item?.name || ''}
                    required
                    onInput={handleOnInput}
                    onChange={(e: any) => console.log('# => onChange => e => ', e.target.value)}
                    placeholder="Enter a bank"
                />
            </div>
            <div style={{ gap: '1rem', display: 'grid', marginTop: '2rem', gridTemplateColumns: '1fr 1fr' }}>
                <Button context="error" appearance="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" context="success">Save</Button>
            </div>
        </form>
    )
}