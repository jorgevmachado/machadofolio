import React, { useRef, useState } from 'react';

import { fileToBase64, imageTypeValidator, urlToBase64 } from '@repo/services';

import DOC_IMAGE from '../../../../../assets/doc.png';
import PDF_IMAGE from '../../../../../assets/pdf.png';
import XLSX_IMAGE from '../../../../../assets/xlsx.png';

import { type TContext, joinClass } from '../../../../../utils';

import { Image } from '../../../../../elements'

import Button from '../../../../button'

import './File.scss';

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    context: TContext;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
    withPreview?: boolean;
}

export default function FileInput({
    accept,
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
                result.previewImage = await urlToBase64(PDF_IMAGE);
                break;
            case 'xlsx':
                result.previewImage = await urlToBase64(XLSX_IMAGE);
                break;
            default:
                result.previewImage = await urlToBase64(DOC_IMAGE);
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
    };


    return (
        <div className={classNameList} data-testid="ds-file-input">
            { (withPreview && preview) && (
                <div className="ds-file-input__preview">
                    <Image src={preview} alt="Preview" className="ds-file-input__preview--image"/>
                </div>
            )}
            <div className={inputFieldClassName}>
                <Button
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