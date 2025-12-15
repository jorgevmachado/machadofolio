import React ,{ useEffect ,useState } from 'react';

import { type EMonth ,type ReplaceWordParam } from '@repo/services';

import { Button } from '@repo/ds';

import type {
  Bill,
  UploadsExpenseParams
} from '@repo/business';

import IgnoreWords from './ignore-words';
import ReplaceWords from './replace-words';
import { type Form ,type UploadListItem } from './types';
import UploadFiles from './upload-files';

import './Upload.scss';

type UploadProps = {
  bill: Bill
  onClose: () => void;
  onSubmit: (bill: Bill, params: UploadsExpenseParams) => Promise<void>;
}

export default function Upload({
  bill,
  onClose,
  onSubmit
}: UploadProps) {
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
    <form onSubmit={handleSubmit} className="upload">
      <UploadFiles uploads={uploads} updateUploads={setUploads}/>

      <IgnoreWords repeatedWords={form.repeatedWords} updateRepeatedWords={updateRepeatedWords}/>

      <ReplaceWords replaceWords={form.replaceWords} updateReplaceWords={updateReplaceWords}/>

      <div className="upload__actions">
        <Button context="error" appearance="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" context="success" disabled={buttonDisabled}>Upload</Button>
      </div>
    </form>
  );
};