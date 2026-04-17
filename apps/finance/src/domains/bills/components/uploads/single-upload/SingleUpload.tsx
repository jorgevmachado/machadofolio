import React ,{ useCallback ,useEffect ,useState } from 'react';

import { type EMonth ,type ReplaceWordParam } from '@repo/services';

import {
  type BillList ,
  type UploadBillParams ,
  type UploadExpenseParams,
} from '@repo/business';

import { Button } from '@repo/ds';

import IgnoreWords from '../ignore-words';
import ReplaceWords from '../replace-words';
import type { Form ,UploadListItem } from '../types';
import UploadFiles from '../upload-files';

import './SingleUpload.scss';

type SingleUploadProps = {
  onClose: () => void;
  billList: Array<BillList>
  onSubmit: (params: UploadBillParams) => void;
}

export default function SingleUpload({
  onClose ,
  onSubmit ,
}: SingleUploadProps) {
  const [uploads ,setUploads] = useState<Array<UploadListItem>>([]);
  const [buttonDisabled ,setButtonDisabled] = useState<boolean>(true);

  const [form ,setForm] = useState<Form>({
    file: '' ,
    paid: false ,
    month: '' ,
    fileName: '' ,
    replaceWords: [] ,
    repeatedWords: [],
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = validatorForm();

    if (!valid) {
      return;
    }
    const upload = uploads[0];


    if (!upload) {
      return;
    }
    
    const uploadExpenseParams: UploadExpenseParams = {
      file: upload.file ,
      paid: upload.paid ,
      month: upload?.month?.toUpperCase() as EMonth ,
      replaceWords: form.replaceWords ,
      repeatedWords: form.repeatedWords ,
    };

    onSubmit(uploadExpenseParams);
    onClose();
  };

  const validatorForm = useCallback(() => {
    const invalid = uploads.length === 0;
    setButtonDisabled(invalid);
    return !invalid;
  }, [uploads]);

  const updateRepeatedWords = (repeatedWords: Array<string>) => {
    setForm((prev) => ({ ...prev ,repeatedWords }));
  };

  const updateReplaceWords = (replaceWords: Array<ReplaceWordParam>) => {
    setForm((prev) => ({ ...prev ,replaceWords }));
  };

  const handleUploadsFile = (uploads: Array<UploadListItem>) => {
    setUploads(uploads);
  };

  useEffect(() => {
    validatorForm();
  }, [uploads, validatorForm]);

  return (
    <form onSubmit={ handleSubmit } className="single-upload">
      <UploadFiles type="single"  uploads={ uploads } className="single-upload__file" updateUploads={ handleUploadsFile }/>

      <IgnoreWords empty={true} repeatedWords={ form.repeatedWords } updateRepeatedWords={ updateRepeatedWords }/>

      <ReplaceWords empty={true} replaceWords={ form.replaceWords }
        updateReplaceWords={ updateReplaceWords }/>

      <div className="single-upload__actions">
        <Button context="error" appearance="outline"
          onClick={ onClose }>Cancel</Button>
        <Button type="submit" context="success"
          disabled={ buttonDisabled }>Upload</Button>
      </div>
    </form>
  );
}