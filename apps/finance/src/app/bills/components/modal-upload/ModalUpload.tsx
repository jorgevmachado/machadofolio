import React, { useEffect, useState } from 'react';

import { type EMonth, type ReplaceWordParam } from '@repo/services';

import { type Bill, type UploadsExpenseParams } from '@repo/business';

import { Button } from '@repo/ds';

import IgnoredWords from './ignore-words';
import ReplaceWords from './replace-words';
import { type UploadListItem } from './types';
import UploadFiles from './upload-files';

import './ModalUpload.scss';

type ModalUploadProps = {
    bill: Bill
    onClose: () => void;
    onSubmit: (bill: Bill, params: UploadsExpenseParams) => Promise<void>;
}

type Form = {
    paid: boolean;
    file: string;
    month: string;
    fileName: string;
    replaceWords: Array<ReplaceWordParam>;
    repeatedWords: Array<string>;
}

export function ModalUpload({ bill, onClose, onSubmit }: ModalUploadProps) {
  const [form, setForm] = useState<Form>({
    paid: false,
    file: '',
    month: '',
    fileName: '',
    replaceWords: [],
    repeatedWords: []
  });
  const [uploads, setUploads] = useState<Array<UploadListItem>>([]);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  const validatorForm = () => {
    const uploadButtonDisabled = uploads.length === 0;
    setButtonDisabled(uploadButtonDisabled);
    return !uploadButtonDisabled;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = validatorForm();
    if (!valid) {
      return;
    }

    const uploadsExpenseParams: UploadsExpenseParams = {
      files: uploads.flatMap((item) => item.file),
      paid: uploads.flatMap((item) => Boolean(item.paid)),
      months: uploads.flatMap((item) => item.month?.toUpperCase() as EMonth),
      replaceWords: form.replaceWords,
      repeatedWords: form.repeatedWords,
    };

    await onSubmit(bill, uploadsExpenseParams);
    onClose();
  };

  const updateRepeatedWords = (repeatedWords: Array<string>) => {
    setForm((prev) => ({ ...prev, repeatedWords }));
  };

  const updateReplaceWords = (replaceWords: Array<ReplaceWordParam>) => {
    setForm((prev) => ({ ...prev, replaceWords }));
  };

  useEffect(() => {
    validatorForm();
  }, [uploads]);

  return (
    <form onSubmit={handleSubmit} className="modal-upload">
      <UploadFiles uploads={uploads} updateUploads={setUploads}/>

      <IgnoredWords repeatedWords={form.repeatedWords} updateRepeatedWords={updateRepeatedWords}/>

      <ReplaceWords replaceWords={form.replaceWords} updateReplaceWords={updateReplaceWords}/>

      <div className="modal-upload__actions">
        <Button context="error" appearance="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" context="success" disabled={buttonDisabled}>Upload</Button>
      </div>
    </form>
  );
}