import React ,{ useMemo ,useState } from 'react';

import type { handleOnInputParams } from 'finance/src/components/types';

import { Button ,Card ,Input } from '@repo/ds';

import { currentValue ,type PersistInputProps } from '../../utils';

import DependencyFallback from '../dependency-fallback';

import './Filter.scss';

type ButtonProps = React.ComponentProps<typeof Button>;
type DependencyFallbackProps = React.ComponentProps<typeof DependencyFallback>;

type FilterActionProps = Omit<ButtonProps ,'children'> & {
  label: string;
};

type FilterProps = {
  inputs: ReadonlyArray<PersistInputProps>;
  action?: FilterActionProps;
  onFilter?: (item?: unknown) => void;
  fallback?: DependencyFallbackProps;
  'data-testid'?: string;
};

export default function Filter({
  inputs ,
  action ,
  onFilter ,
  fallback ,
  'data-testid': dataTestId = 'ui-filter' ,
}: Readonly<FilterProps>) {

  const [currentItem ,setCurrentItem] = useState<unknown>(undefined);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onFilter?.(currentItem);
    setCurrentItem(undefined);
  };

  const rows = useMemo(() => {

    const normalInputs = inputs.filter(
      input => input.type !== 'textarea' && input.type !== 'radio-group'
    );
    const singleRowInputs = inputs.filter(
      input => input.type === 'textarea' || input.type === 'radio-group'
    );

    const groupedNormalInputs = normalInputs.reduce<Array<Array<PersistInputProps>>>(
      (acc, input, idx) => {
        if (idx % 2 === 0) {
          return [...acc, [input]];
        }
        const lastRow = acc[acc.length - 1] ?? [];
        return  [...acc.slice(0, -1), [...lastRow, input]];
      },
      []
    );


    const singleRows = singleRowInputs.map(input => [input]);

    return [...groupedNormalInputs, ...singleRows];
  } ,[inputs]);

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
      [name]: value ,
    }));

  };

  const currentFallback = useMemo(() => {
    const fallbackProps = { ...fallback };
    if (!fallback?.message) {
      fallbackProps.message = { text: 'No results found' };
    }
    return fallbackProps;

  } ,[fallback]);

  return (
    <Card>
      {
        inputs.length === 0 ? <DependencyFallback { ...currentFallback }/> : (
          <form
            aria-label="Filter form"
            className="ui-filter"
            onSubmit={ handleSubmit }
            data-testid={ dataTestId }
          >
            <div className="ui-filter__container" data-testid={ `${ dataTestId }-container` }>
              <div className="ui-filter__container--inputs" data-testid={ `${ dataTestId }-container-inputs` }>
                { rows.map((row, index) => {
                  const rowKey = row.map(input => input.name).join('-');
                  return (
                    <div
                      key={ rowKey }
                      className="ui-filter__container--inputs-item"
                      data-testid={ `${ dataTestId }-input-row-${ index }` }
                    >
                      { row.map((input) => {
                        const { list ,...inputProps } = input;
                        return (
                          <div
                            key={ input.name }
                            className="ui-filter__container--inputs-item__row"
                            data-testid={ `${ dataTestId }-input-row-item-${ index }` }
                          >
                            <Input
                              { ...inputProps }
                              value={ currentValue({
                                name: input.name ,
                                item: currentItem ,
                                type: input.type,
                              }) }
                              onInput={ (params) => handleOnInput(
                                { ...params ,type: input.type ,list }
                              ) }
                              required={ false }
                              data-testid={ `${ dataTestId }-input-row-item-${ index }-input` }
                            />
                          </div>
                        );
                      }) }
                    </div>
                  );
                }) }
              </div>
              <div className="ui-filter__container--action">
                <Button
                  { ...action }
                  icon={ action?.icon ?? {
                    icon: 'search' ,
                    position: 'right',
                  } }
                  type={ action?.type ?? 'submit' }
                  style={ { padding: '10px 32px' } }
                  context={ action?.context ?? 'primary' }
                  disabled={ !currentItem }
                  aria-label={ action?.['aria-label'] ?? 'Filter' }
                  data-testid={ `${ dataTestId }-action-button}` }
                >
                  { action?.label ?? 'Filter' }
                </Button>
              </div>
            </div>
          </form>
        )
      }
    </Card>
  );
}