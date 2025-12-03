import React ,{ useMemo } from 'react';

import { Button } from '@repo/ds';

import './Delete.scss';

type ButtonProps = React.ComponentProps<typeof Button>;

type DeleteProps = {
  item: unknown;
  onClose: (type?: 'deleted' | 'canceled') => void;
  onDelete?: (item: unknown) => Promise<void>;
  deleteButton?: ButtonProps;
  cancelButton?: ButtonProps;
  'data-testid'?: string;
}

export default function ModalDelete({
  item,
  onClose,
  onDelete,
  deleteButton,
  cancelButton,
  'data-testid': dataTestId = 'ui-delete'
}: Readonly<DeleteProps>) {

  const handleOnDelete = async  () => {
    onDelete?.(item);
    onClose('deleted');
  }

  const handleOnCancel = () => {
    onClose('canceled');
  }

  const cancelProps = useMemo(() => {
    const defaultProps: ButtonProps = {
      context: 'error',
      appearance: 'outline',
    }
    return { ...defaultProps, ...cancelButton };
  }, [cancelButton]);

  const deleteProps = useMemo(() => {
    const defaultProps: ButtonProps = {
      context: 'error',
    }
    return { ...defaultProps, ...deleteButton };
  }, [deleteButton]);

  return (
    <div id="ui-delete" className="ui-delete" data-testid={dataTestId}>
      <Button
        {...cancelProps}
        data-testid={cancelProps?.['data-testid'] ?? `${dataTestId}-btn-cancel`}
        onClick={cancelProps?.onClick ?? handleOnCancel}>
        {cancelProps?.children ?? 'Cancel'}
      </Button>
      <Button
        {...deleteProps}
        onClick={deleteProps?.onClick ?? handleOnDelete}
        data-testid={deleteProps?.['data-testid'] ?? `${dataTestId}-btn-submit`}
      >
        {deleteProps?.children ?? 'Delete'}
      </Button>
    </div>
  );
}