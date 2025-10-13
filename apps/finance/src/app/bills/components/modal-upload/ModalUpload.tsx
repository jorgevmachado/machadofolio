import React, { useEffect, useState } from 'react';

import { EMonth, MONTHS, type ReplaceWordParam } from '@repo/services';

import { Bill, type UploadExpenseParams } from '@repo/business';

import { Button, Input, Switch } from '@repo/ds';

import IgnoredWords from './ignore-words';
import ReplaceWords from './replace-words';

import './ModalUpload.scss';

type ModalUploadProps = {
    bill: Bill
    onClose: () => void;
    onSubmit: (bill: Bill, params: UploadExpenseParams) => Promise<void>;
}

type Form = {
    paid: boolean;
    file: string;
    month: string;
    replaceWords: Array<ReplaceWordParam>;
    repeatedWords: Array<string>;
}


export function ModalUpload({ bill, onClose, onSubmit }: ModalUploadProps) {
    const [form, setForm] = useState<Form>({ paid: false, file: '', month: '', replaceWords: [], repeatedWords: [] });
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

    const validatorForm = (submit?: boolean) => {
        const { month, file } = form;
        const disabled = month === '' || file === ''
        setButtonDisabled(disabled);
        if(submit) {

        }
        return !disabled;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const valid = validatorForm(true);
        if(!valid) {
            return;
        }

        await onSubmit(bill, {
            ...form,
            month: form.month as EMonth,
        });
        onClose();
    }

    const handleOnInput = (name: string, value: string | boolean) => {
        setForm((prev) => ({...prev, [name]: value}))
    }

    const updateRepeatedWords = (repeatedWords: Array<string>) => {
        setForm((prev) => ({...prev, repeatedWords}));
    }

    const updateReplaceWords = (replaceWords: Array<ReplaceWordParam>) => {
        setForm((prev) => ({...prev, replaceWords}))
    }

    useEffect(() => {
        validatorForm();
    }, [form.file, form.month]);

    return (
        <form onSubmit={handleSubmit} className="modal-upload">
            <div className="modal-upload__inputs">
                <Input
                    id="file_upload"
                    name="file"
                    fluid
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onInput={({name, value}) => handleOnInput(name, value as string)}
                    className="modal-upload__inputs--item"/>
                <Switch
                    label="Paid"
                    checked={form.paid}
                    onChange={(_, checked) => handleOnInput('paid', checked)}
                />
                <Input
                    id="select_month_upload"
                    type="select"
                    fluid
                    name="month"
                    label="Month"
                    options={MONTHS.map((item) => ({ value: item.toUpperCase(), label: item, }))}
                    required
                    onInput={({name, value}) => handleOnInput(name, value as string)}
                    className="modal-upload__inputs--item"
                    placeholder="Choose a Month"
                />
            </div>

            <IgnoredWords repeatedWords={form.repeatedWords} updateRepeatedWords={updateRepeatedWords}/>

            <ReplaceWords replaceWords={form.replaceWords} updateReplaceWords={updateReplaceWords}/>

            <div className="modal-upload__actions">
                <Button context="error" appearance="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" context="success" disabled={buttonDisabled}>Upload</Button>
            </div>
        </form>
    )
}