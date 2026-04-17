import React from 'react';

import { Button } from '@repo/ds';

import './NubankUpload.scss';
type NubankUploadProps = {
  onClose: () => void;
  onSubmit: () => void;
}
export default function NubankUpload({
  onClose,
  onSubmit
}: NubankUploadProps) {
  return (
    <div id="nubank-upload" className="nubank-upload">
      <Button
        onClick={onClose}
        context="error"
        appearance="outline"
      >
        Cancel
      </Button>
      <Button
        onClick={onSubmit}
        context="success"
      >
        Create
      </Button>
    </div>
  );
}