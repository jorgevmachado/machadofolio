'use client';
import React from 'react';

import { Button } from '@repo/ds';

import './ModalDelete.scss';

type ModalDeleteProps = {
    item: unknown;
    onClose: () => void;
    onDelete?: (item: unknown) => Promise<void>;
}

export default function ModalDelete({
  item,
  onClose,
  onDelete
}: ModalDeleteProps) {
  return (
    <div className="moda-delete">
      <Button context="error" appearance="outline" onClick={onClose}>Cancel</Button>
      <Button context="error" onClick={async () => {
        await onDelete?.(item);
        onClose();
      }}>Delete</Button>
    </div>
  );
}