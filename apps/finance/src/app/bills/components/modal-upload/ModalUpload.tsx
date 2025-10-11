import React, { useState } from 'react';

import { EMonth, MONTHS } from '@repo/services';

import { Bill, UploadExpenseParams } from '@repo/business';

import { Button, Input } from '@repo/ds';

import './ModalUpload.scss';

type ModalUploadProps = {
    bill: Bill
    onClose: () => void;
    onSubmit: (bill: Bill, file: any, params: UploadExpenseParams) => Promise<void>;
}

type Form = {
    file: string;
    month: string;
}

export function ModalUpload({ bill, onClose, onSubmit }: ModalUploadProps) {
    const [form, setForm] = useState<Form>({ file: '', month: ''});

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { month , file } = form;
        if(month === '' || file === '') {
            return;
        }
        console.log('# => file => ', file);
        await onSubmit(bill, file, { month: month as EMonth})
    }

    function handleOnInput(name: string, value: string) {
        setForm((prev) => ({...prev, [name]: value}))
    }

    return (
        <form onSubmit={handleSubmit} className="modal-upload">
            <div className="modal-upload__inputs">
                <Input
                    id="file_upload"
                    name="file"
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onInput={({name, value}) => handleOnInput(name, value as string)}
                    className="modal-upload__inputs--item"/>
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
            <div className="modal-upload__actions">
                <Button context="error" appearance="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" context="success">Upload</Button>
            </div>
        </form>
    )
}