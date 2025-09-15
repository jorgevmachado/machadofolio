import React, { useEffect, useRef, useState } from 'react';

import { ValidatorParams } from '@repo/services';

import { EExpenseType, Expense, Supplier } from '@repo/business';

import { Button, Input, OnInputParams, Switch } from '@repo/ds';

import './Persist.scss';
import { InputGroup, InputGroupItem, PersistForm } from './types';
import { DEFAULT_PERSIST_FORM, getInputGroup } from './config';

type PersistProps = {
    onClose: () => void;
    expense?: Expense;
    onSubmit: (fields: PersistForm['fields'], expense?: Expense) => void;
    suppliers: Array<Supplier>;
}

type InputProps = React.ComponentProps<typeof Input>;


type CurrentValueParams = {
    type: InputProps['type'];
    name?: string;
    item?: Expense;
}

export default function Persist({
    onClose,
    expense,
    onSubmit,
    suppliers,
}: PersistProps) {
    const isMounted = useRef(false);

    const [inputGroups, setInputGroups] = useState<Array<InputGroup>>([]);
    const [inputs, setInputs] = useState<Array<InputGroupItem>>([]);
    const [persistForm, setPersistForm] = useState<PersistForm>(DEFAULT_PERSIST_FORM);
    const [currentExpense, setCurrentExpense] = useState<Expense | undefined>(expense);

    const mergeExpense = (fields: PersistForm['fields'], expense?: Expense) => {
        setCurrentExpense(expense)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleValidatorForm();
        mergeExpense(persistForm.fields, expense);
        onSubmit?.(persistForm.fields, expense);
        onClose();
    };

    const handleValidatorForm = () => {
        const persistFormDraft = { ...persistForm };
        const { valid, errors, messages, updatedInputs } = inputs.reduce((acc, input) => {
            const value = persistFormDraft.fields[input.name as keyof PersistForm['fields']];
            const validatorMessage = input.validator
                ? input.validator?.({ value: value })
                : { valid: true, message: '' };
            const inputValid = validatorMessage?.valid;
            const message = `${input.label}: ${validatorMessage?.message}`;
            input.validated = { invalid: !inputValid, message };
            if(!inputValid) {
                acc.valid = false;
                acc.messages.push(message);
            }
            acc.errors[input.name as keyof PersistForm['errors']] = validatorMessage;
            acc.updatedInputs.push(input);
            return acc;
        }, {
            valid: true,
            errors: {...persistFormDraft.errors},
            messages: [] as Array<string>,
            updatedInputs: [] as Array<InputGroupItem>
        });

        persistFormDraft.valid = valid;
        persistFormDraft.errors = errors;
        persistFormDraft.message = messages
            .map((message) => `   ${message}`)
            .join('\n');
        setPersistForm(persistFormDraft);
        setInputs(updatedInputs);
    }

    const handleOnInput = ({ value, name }: OnInputParams) => {
        setPersistForm((prev) => ({
            ...prev,
            fields: { ...prev.fields, [name]: value }
        }))
    }

    const handleOnSwitch = (checked: boolean, name?: string)  => {
        if(name) {
            setPersistForm((prev) => ({
                ...prev,
                fields: { ...prev.fields, [name]: checked }
            }))
        }

    }

    const currentValue = ({ name, type, item }: CurrentValueParams ): string => {
        if(item && name) {
            const currentValue = item?.[name as keyof Expense];
            if(type === 'select' && name === 'supplier') {
                return (currentValue as { id?: string })?.id ?? ''
            }
            return typeof currentValue === 'string' ? currentValue : String(currentValue ?? '');
        }
        return '';
    }

    const switchChecked = ({ name, item }: Omit<CurrentValueParams, 'type'>) => {
        if(item && name) {
            const currentValue = item?.[name as keyof Expense];
            if(typeof currentValue === 'boolean') {
                return currentValue;
            }
            return false;
        }
        return false;
    }

    const initializeInputs = (type?: EExpenseType) => {
        const inputGroups = getInputGroup(!expense, type);
        const currentInputGroups = inputGroups.map((group) => ({
            ...group,
            inputs: group.inputs.map((input) => {
                const currentInput = {
                    ...input,
                    value: currentValue({ name: input.name, item: expense, type: input.type }),
                }

                if(input.name === 'supplier') {
                    return {
                        ...currentInput,
                        options: suppliers.map((supplier) => ({ value: supplier.id, label: supplier.name })),
                    }
                }

                return currentInput;
            })
        }));
        setInputGroups(currentInputGroups);
        const inputs = currentInputGroups.flatMap((group) => group.inputs);
        setInputs(inputs);


        const initialAccumulator = {
            fields: { ...persistForm.fields },
            errors: { ...persistForm.errors },
        }

        const { fields, errors } = inputs.reduce((acc, input) => {
            if(expense) {
                acc.fields.id = expense.id;
            }
            if(input.value && input.value !== '') {
                acc.fields[input.name as keyof PersistForm['fields']] = input.value as string;
            }
            acc.errors[input.name as keyof PersistForm['errors']] = undefined;
            if(input.validator && Boolean(expense)) {
                acc.errors[input.name as keyof PersistForm['errors']] = input?.validator({
                    value: (acc.fields as PersistForm['fields'])[input.name as keyof PersistForm['fields']]
                });
            }
           return acc;
        }, initialAccumulator);

        setPersistForm((prev) => ({...prev, fields, errors }));
    }

    useEffect(() => {
        if(!isMounted.current) {
            isMounted.current = true;
            const type = expense?.type;
            initializeInputs(type);
        }
    }, []);

    useEffect(() => {
        if(persistForm.fields.type){
            initializeInputs(persistForm?.fields?.type as EExpenseType);
        }
    }, [persistForm.fields?.type]);

    function handleValidator(input: Omit<InputGroupItem, 'show'>, params: ValidatorParams) {
        if(!input.validator) {
            return {
                valid: true,
                message: ''
            };
        }
        return input.validator(params);
    }

    return (
        <form onSubmit={handleSubmit} className="persist">
            {inputGroups?.map((group) => (
                <div key={group.id} className={group?.className ?? 'persist__row'}>
                    {group.inputs.map(({show, ...input}) => (
                        <React.Fragment key={input.name}>
                            {show && input.label !== 'Paid' && (
                                <Input
                                    {...input}
                                    onInput={handleOnInput}
                                    className="persist__row--item"
                                    validator={(params) => handleValidator(input, params)}
                                />
                            )}
                            {show && input.label === 'Paid' && (
                                <Switch
                                    label={input.label}
                                    checked={switchChecked({ name: input.name, item: expense })}
                                    onChange={(_, checked ) => handleOnSwitch(checked, input.name)}
                                    className="persist__row--switch"
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            ))}

            <div className="persist__actions">
                <Button context="error" appearance="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" context="success">Save</Button>
            </div>
        </form>
    )
}