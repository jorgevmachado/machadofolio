import React, { useEffect, useRef, useState } from 'react';

import { extractExtensionFromBase64, fileToBase64, imageTypeValidator, urlToBase64 } from '@repo/services';

import {
    XLSX_IMAGE_BASE64,
    DOC_IMAGE_BASE64,
    PDF_IMAGE_BASE64
} from '../../../../../assets/base64';

import { type TContext, joinClass } from '../../../../../utils';

import { Icon, Image } from '../../../../../elements'

import Button from '../../../../button'

import './File.scss';

type FileProps = {
    value: string;
    preview: string;
    fileName: string;
}

export type OnFileChangeParams = {
    name: string;
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    files?: Array<FileProps>;
    value?: string;
    preview?: string;
    filesName?: Array<string>;
}

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onInput' | 'onChange'> {
    onInput?: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => void;
    context: TContext;
    onChange?: (params: OnFileChangeParams) => void;
    onRemove?: () => void;
    clearFile?: boolean;
    withPreview?: boolean;
    showRemoveButton?: boolean;
}

export default function FileInput({
    name = 'file',
    value,
    accept,
    onInput,
    context,
    disabled,
    onChange,
    onRemove,
    multiple,
    clearFile,
    className,
    withPreview,
    showRemoveButton,
    ...props
}: FileInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [filesName, setFilesName] = useState<Array<string>>([]);
    const [preview, setPreview] = useState<string | null>(null);

    const fallBackMessage = !multiple ? 'No file selected' : 'No files selected';

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

        const targetFiles = e.target.files;
        const files: Array<FileProps> = [];
        const currentFilesNames: Array<string> = [];
        if(targetFiles && targetFiles.length > 0) {
            for(let i = 0; i < targetFiles?.length; i++) {
                const targetFile = targetFiles[i];
                if(!targetFile) {
                    return;
                }
                const { previewFile: value, previewImage: preview } = await buildFilePreview(targetFile);
                const fileName = targetFile.name;

                currentFilesNames.push(fileName);

                const file: FileProps = {
                    value,
                    preview,
                    fileName
                }
                files.push(file);
            }

            if(files.length > 0) {
                const firstFile = files[0];
                const file = {
                    value: undefined as string | undefined,
                    preview: undefined as string | undefined,
                }
                setFilesName(currentFilesNames);

                if(firstFile) {
                    file.value = firstFile.value;
                    file.preview = firstFile.preview;
                    setPreview(file.preview);
                }

                if(onChange) {
                    onChange({
                        ...file,
                        name,
                        event: e,
                        files,
                        filesName: currentFilesNames
                    })
                }

                if(onInput) {
                    onInput(e as React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, file.value);
                }

            }
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setFilesName([]);

        if (inputRef.current) {
            inputRef.current.value = '';
        }

        if (onRemove) {
            onRemove();
        }

        if (onChange) {
            const event = { target: inputRef.current } as React.ChangeEvent<HTMLInputElement>;
            onChange({ name, event });
        }

        if (onInput) {
            onInput({ target: inputRef.current } as unknown as React.FormEvent<HTMLInputElement>, undefined);
        }
    };

    useEffect(() => {
        if(value && withPreview) {
            (async () => {
                const base64 = await urlToBase64(value as string);
                const extension = extractExtensionFromBase64(base64);
                if(extension) {
                    setPreview(base64);
                    setFilesName([`file.${extension}`]);
                }

            })();
        }
    }, [value, withPreview]);

    useEffect(() => {
        if (clearFile) {
            handleRemove();
        }
    }, [clearFile]);

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
                    {...props}
                    ref={inputRef}
                    type="file"
                    name={name}
                    accept={accept}
                    multiple={multiple}
                    style={{ display: 'none' }}
                    onChange={handleChange}
                    disabled={disabled}
                />
                {filesName.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {filesName.map((fileName, index) => (
                            <div key={index}>
                                <span className="ds-file-input__filename">{fileName}</span>
                            </div>
                        ))}
                    </div>
                    ) : (
                    <span className="ds-file-input__filename">{fallBackMessage}</span>
                )}

                {(filesName.length > 0 && showRemoveButton) && (
                    <Icon
                        icon="trash"
                        color="error-100"
                        onClick={handleRemove}
                        className="ds-file-input__icon-remove"
                    />
                )}
            </div>
        </div>
    )
}