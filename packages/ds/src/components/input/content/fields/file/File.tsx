import React, { useEffect, useRef, useState } from 'react';

import { extractExtensionFromBase64, fileToBase64, imageTypeValidator, urlToBase64 } from '@repo/services';

import {
    XLSX_IMAGE_BASE64,
    DOC_IMAGE_BASE64,
    PDF_IMAGE_BASE64
} from '../../../../../assets/base64';

import { type TContext, joinClass } from '../../../../../utils';

import { Image } from '../../../../../elements'

import Button from '../../../../button'

import './File.scss';

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onInput' | 'onChange'> {
    onInput?: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => void;
    context: TContext;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
    withPreview?: boolean;
}

export default function FileInput({
    value,
    accept,
    onInput,
    context,
    disabled,
    onChange,
    className,
    withPreview,
    ...props
}: FileInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>('');
    const [preview, setPreview] = useState<string | null>(null);

    const classNameList = joinClass([
        'ds-file-input',
    ]);

    const inputFieldClassName = joinClass([
        'ds-file-input__field',
        className,
    ]);

    const buildFilePreview = async (file: File) => {
        const result = { previewImage: '', previewFile: '' };
        const extension = file.name.split('.').pop()?.toLowerCase();
        const isImage = imageTypeValidator({ accept: `.${extension}`}).valid;
        result.previewFile = await fileToBase64(file);
        if(isImage) {
            result.previewImage = result.previewFile;
            return result;
        }

        switch (extension) {
            case 'pdf':
                result.previewImage = PDF_IMAGE_BASE64;
                break;
            case 'xlsx':
                result.previewImage = XLSX_IMAGE_BASE64;
                break;
            default:
                result.previewImage = DOC_IMAGE_BASE64;
                break;
        }

        return result;
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setPreview(null);

        const file = e.target.files?.[0];
        setFileName(file ? file.name : '');
        const result = { currentFile: undefined as string | undefined };

        if (file) {
            const { previewFile, previewImage } = await buildFilePreview(file);
            setPreview(previewImage);
            result.currentFile = previewFile;
        }

        if (onChange) {
            onChange(e, result.currentFile);
        }

        if(onInput) {
            onInput(e as React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, result.currentFile);
        }
    };

    useEffect(() => {
        if(value && withPreview) {
            (async () => {
                const base64 = await urlToBase64(value as string);
                const extension = extractExtensionFromBase64(base64);
                if(extension) {
                    setPreview(base64);
                    setFileName(`file.${extension}`);
                }

            })();
        }
    }, [value, withPreview]);


    return (
        <div className={classNameList} data-testid="ds-file-input">
            { (withPreview && preview) && (
                <div className="ds-file-input__preview">
                    <Image src={preview} alt="Preview" className="ds-file-input__preview--image"/>
                </div>
            )}
            <div className={inputFieldClassName}>
                <Button
                    type="button"
                    size="small"
                    onClick={() => inputRef.current?.click()}
                    context={context}
                    disabled={disabled}
                    className="ds-file-input__button">
                    Select file
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    style={{ display: 'none' }}
                    onChange={handleChange}
                    disabled={disabled}
                    {...props}
                />
                <span className="ds-file-input__filename">{fileName || 'No files selected'}</span>
            </div>
        </div>
    )
}