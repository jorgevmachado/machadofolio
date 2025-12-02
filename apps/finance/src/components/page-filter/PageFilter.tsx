'use client'

import React, { useMemo, useState } from 'react';

import { Button, Card, Input } from '@repo/ds';

import { useI18n } from '@repo/i18n';

import type { handleOnInputParams, PersistInputProps } from '../types';
import { currentValue } from '../utils';

import './PageFilter.scss';

type ButtonProps = React.ComponentProps<typeof Button>;

type PageFilterActionProps = Omit<ButtonProps, 'children'> & {
    label: string;
};

interface PageFilterProps {
    readonly inputs: ReadonlyArray<PersistInputProps>;
    readonly action?: PageFilterActionProps;
    readonly onFilter?: (item?: unknown) => void;
}

export default function PageFilter({ inputs, action, onFilter }: Readonly<PageFilterProps>) {
    const { t } = useI18n();

    const [currentItem, setCurrentItem] = useState<unknown>(undefined);

    const rows = useMemo(() => {
        const result: Array<Array<PersistInputProps>> = [];
        for (let i = 0; i < inputs.length; i += 2) {
            result.push(inputs.slice(i, i + 2));
        }
        return result;
    }, [inputs]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onFilter?.(currentItem);
        setCurrentItem(undefined);
    }

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

    return (
        <Card>
            <form aria-label='Page filter form' className="page-filter" onSubmit={handleSubmit}>
                <div className="page-filter__container">
                    <div className="page-filter__container--inputs">
                        {rows.map((row) => {
                            const rowKey = row.map(input => input.name).join('-');
                            return (
                                <div key={rowKey} className="page-filter__container--inputs-item">
                                    {row.map((input) => {
                                        const { list, ...inputProps } = input;
                                        return (
                                            <div key={input.name} className="page-filter__container--inputs-item__row">
                                                <Input
                                                    {...inputProps}
                                                    value={currentValue({ name: input.name, item: currentItem, type: input.type })}
                                                    onInput={(params) => handleOnInput({...params, type: input.type, list})}
                                                    required={false}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                    <div className="page-filter__container--action">
                        <Button
                            {...action}
                            icon={action?.icon ?? {
                                icon: 'search',
                                position: 'right'
                            }}
                            type={action?.type ?? 'submit'}
                            style={{ padding: '10px 32px'}}
                            context={action?.context ?? 'primary'}
                            aria-label={action?.['aria-label'] ?? 'Filter'}
                        >
                            {action?.label ?? t('filter')}
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    );
}