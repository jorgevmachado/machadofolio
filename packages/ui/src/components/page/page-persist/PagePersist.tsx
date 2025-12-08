import React ,{ useMemo ,useState } from 'react';

import { Button ,Input } from '@repo/ds';

import {
  currentValue ,
  type handleOnInputParams ,
  type PersistInputProps ,
} from '../../../utils';

import './PagePersist.scss';

type ButtonProps = React.ComponentProps<typeof Button>;

type PagePersistProps = {
  item?: unknown;
  inputs: Array<PersistInputProps>;
  onClose: (type?: 'submitted' | 'canceled') => void;
  onSubmit?: (item?: unknown) => void;
  submitButton?: ButtonProps;
  cancelButton?: ButtonProps;
  'data-testid'?: string;
};

export default function PagePersist({
  item ,
  inputs ,
  onClose ,
  onSubmit ,
  submitButton ,
  cancelButton ,
  'data-testid': dataTestId = 'ui-page-persist',
}: PagePersistProps) {

  const [currentItem ,setCurrentItem] = useState<unknown>(item);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(currentItem);
    onClose('submitted');
  };

  const handleOnCancel = () => {
    onClose('canceled');
  };

  const handleOnInput = ({
    value ,
    name ,
    type ,
    list = [] ,
  }: handleOnInputParams) => {
    if (type === 'select') {
      const currentValue = list?.find(
        (item) => (item as { id?: string })?.id === value ,
      );
      setCurrentItem((prev: Record<string ,unknown> = {}) => ({
        ...prev ,
        [name]: currentValue ,
      }));
      return;
    }
    setCurrentItem((prev: Record<string ,unknown> = {}) => ({
      ...prev ,
      [name]: value,
    }));
  };

  const cancelProps = useMemo(() => {
    const defaultProps: ButtonProps = {
      id: 'ui-page-persist-cancel' ,
      context: 'error' ,
      appearance: 'outline' ,
    };
    return { ...defaultProps ,...cancelButton };
  } ,[cancelButton]);

  const submitProps = useMemo(() => {
    const defaultProps: ButtonProps = {
      id: 'ui-page-persist-submit' ,
      type: 'submit' ,
      context: 'success' ,
    };
    return { ...defaultProps ,...submitButton };
  } ,[submitButton]);

  return (
    <form
      aria-label="Persist form"
      className="ui-page-persist"
      onSubmit={ handleSubmit }
      data-testid={ dataTestId }>
      { inputs.length === 0 ? (
        <div className="ui-page-persist__empty">No inputs to persist</div>
      ) : (
        <>
          <div
            className="ui-page-persist__inputs"
            data-testid={ `${ dataTestId }-inputs` }
          >
            { inputs?.map((input ,index) => {
              const { list ,...inputProps } = input;
              return (
                <Input
                  { ...inputProps }
                  key={ input.name }
                  value={ currentValue(
                    { name: input.name ,item: currentItem ,type: input.type }) }
                  onInput={ (params) => handleOnInput(
                    { ...params ,type: input.type ,list }) }
                  data-testid={ `${ dataTestId }-inputs-${ index }` }
                />
              );
            }) }
          </div>
          <div
            className="ui-page-persist__actions"
            data-testid={ `${ dataTestId }-actions` }
          >
            <Button
              { ...cancelProps }
              data-testid={ cancelProps?.['data-testid'] ??
                `${ dataTestId }-actions-cancel` }
              onClick={ cancelProps?.onClick ?? handleOnCancel }>
              { cancelProps?.children ?? 'Cancel' }
            </Button>
            <Button
              { ...submitProps }
              data-testid={ submitProps?.['data-testid'] ??
                `${ dataTestId }-actions-submit` }
            >
              { submitProps?.children ?? 'Save' }
            </Button>
          </div>
        </>
      )}
    </form>
  );
}