import React, { useEffect, useState } from 'react';

import { MONTHS, EMonth } from '@repo/services';

import { Button, Input, OptionsProps, Switch, Table } from '@repo/ds';

import { UploadListItem } from '../types';

import './UploadFiles.scss';

type UploadFilesProps = {
    uploads: Array<UploadListItem>;
    updateUploads: (uploads: Array<UploadListItem>) => void;
}

type InputProps = React.ComponentProps<typeof Input>;

const DEFAULT_INPUT: Array<InputProps> = [
    {
        id: 'file',
        key: 'file',
        name: 'file',
        fluid: true,
        type: 'file',
        accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
    },
    {
        id: 'paid',
        key: 'paid',
        type: 'text',
        label: 'Paid',
        checked: false,
    },
    {
        id: 'select_month_upload',
        key: 'month',
        type: "select",
        fluid: true,
        name: 'month',
        required: true,
        placeholder: 'Choose a Month'
    }
];

type Form = {
    paid: boolean;
    file: string;
    month: string;
    fileName: string;
}

export default function UploadFiles({ uploads, updateUploads }: UploadFilesProps) {
    const [currentUploads, setCurrentUploads] = useState<Array<UploadListItem>>(uploads);
    const [inputs, setInputs] = useState<Array<InputProps>>(DEFAULT_INPUT);
    const [form, setForm] = useState<Form>({ paid: false, file: '', month: '', fileName: '' });
    const [shouldClearFile, setShouldClearFile] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
    const [months, setMonths] = useState<Array<OptionsProps>>(MONTHS.map((item) => ({ value: item.toUpperCase(), label: item, })));

    const handleOnInput = (name: string, value: string | boolean) => {
        setForm((prev) => ({...prev, [name]: value}))
    }

    const treatValue = (name?: string) => {
        if(!name) {
            return '';
        }
        return form[name as keyof Form] as string;
    }

    const buildInputs = (months: Array<OptionsProps>, uploads?: Array<UploadListItem>) => {
        const currentMonths = !uploads ? [] : uploads.flatMap((item) => item.month?.toLowerCase() as string);
        const monthsFiltered = months.filter((item) => !currentMonths.includes(item.value.toLowerCase() as string));
        const currentInputs = inputs.map((input) => ({
            ...input,
            options: input.type === 'select' ? monthsFiltered : undefined,
        }));
        setInputs(currentInputs);
    }

    const handleAdd=   (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const { paid, file, month, fileName } = form;
        const uploads = [...currentUploads];
        uploads.push({
            index: uploads.length + 1,
            paid,
            file,
            month: month as EMonth,
            fileName,
        });
        setCurrentUploads(uploads);
        updateUploads(uploads);
        buildInputs(months, uploads);
        setButtonDisabled(true);
        setForm((prev) => ({ ...prev, file: '', month: '', paid: false }));
        setShouldClearFile(true);
    }

    const validatorForm = () => {
        const { month, file } = form;
        const addButtonDisabled = month === '' || file === ''
        setButtonDisabled(addButtonDisabled);
        return !addButtonDisabled;
    }

    const handleDeleteUpload = (item: UploadListItem) => {
        const uploadToRemove = uploads.filter((upload) => upload.index !== item.index);
        setCurrentUploads(uploadToRemove);
        updateUploads(uploadToRemove);
        buildInputs(months, uploadToRemove);
    }

    useEffect(() => {
        validatorForm();
    }, [form.file, form.month]);

    useEffect(() => {
        const months = MONTHS.map((item) => ({ value: item.toUpperCase(), label: item, }));
        setMonths(months);
        buildInputs(months);
    }, []);

    return (
        <>
            <div className="upload-files__inputs">
                {inputs.map((input) => (
                    <React.Fragment key={input.key} >
                        {input.type === 'text'
                            ? (
                                <Switch
                                    label="Paid"
                                    checked={form.paid}
                                    onChange={(_, checked) => handleOnInput('paid', checked)}
                                />
                            )
                            : (
                                <Input
                                    {...input}
                                    value={treatValue(input.name)}
                                    onInput={({name, value}) => handleOnInput(name, value as string)}
                                    clearFile={shouldClearFile}
                                    onChangeFile={(e, value, fileName) => {
                                        if(!value) {
                                            setShouldClearFile(false);
                                        }
                                        if(fileName) {
                                            handleOnInput('fileName', fileName);
                                        }
                                    }}
                                    className="modal-upload__inputs--item"
                                />
                            )
                        }
                    </React.Fragment>
                ))}
                <Button context="primary" disabled={buttonDisabled} onClick={handleAdd}>Add</Button>
            </div>

            {uploads.length > 0 && (
                <div>
                    <Table items={uploads.map((item) => ({
                        ...item,
                        paid: !item.paid ? 'NO' : 'YES',
                    }))} headers={[
                        {
                            text: 'Arquivo',
                            value: 'fileName',
                        },
                        {
                            text: 'Mes',
                            value: 'month',
                        },
                        {
                            text: 'Pago',
                            value: 'paid',
                        }
                    ]}
                           actions={{
                               text: '',
                               delete: {
                                   icon: { icon: 'trash' },
                                   onClick: (item: UploadListItem) =>  handleDeleteUpload(item)
                               }
                           }}
                    />
                </div>
            )}
        </>
    )
}