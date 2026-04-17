import React ,{ useEffect ,useRef ,useState } from 'react';

import { router } from 'next/dist/client';

import {
  capitalize ,
  convertToNumber ,
  isObjectEmpty ,
  MONTHS,
} from '@repo/services';

import {
  type CreateIncomeParams ,
  type Income ,
  type IncomeSource ,
} from '@repo/business';

import { Button ,Input ,type OnInputParams ,Switch } from '@repo/ds';

import { useI18n } from '@repo/i18n';

import type {
  CurrentValueParams
} from '../../types';

import './Persist.scss';

type PersistProps = {
  onClose: () => void;
  income?: Income;
  onSubmit: (params: CreateIncomeParams ,Income?: Income) => Promise<void>;
  incomeSources: Array<IncomeSource>;
}

type Validated = {
  invalid: boolean;
  message: string;
}

type ValidatedInputs = {
  name: Validated;
  source: Validated;
}

const DEFAULT_MONTHS: CreateIncomeParams['months'] = MONTHS.map((month) => ({ label: month , value: 0, paid: false }));

const DEFAULT_VALIDATED: Validated = {
  invalid: false,
  message: ''
};

const DEFAULT_VALIDATED_INPUTS: ValidatedInputs = {
  name: DEFAULT_VALIDATED,
  source: DEFAULT_VALIDATED,
};

export default function Persist({
  onClose ,
  onSubmit ,
  income ,
  incomeSources ,
}: PersistProps) {
  const isMounted = useRef(false);
  const { t } = useI18n();

  const [fields ,setFields] = useState<CreateIncomeParams>({
    year: new Date().getFullYear() ,
    source: {} as IncomeSource ,
    name: '' ,
    months: DEFAULT_MONTHS,
    paid: false,
  });
  const [validatedInputs ,setValidatedInputs] = useState<ValidatedInputs>(DEFAULT_VALIDATED_INPUTS);

  const initializeInputs = (income?: Income) => {
    setFields((prev) => {
      prev.source = income?.source ?? {} as IncomeSource;
      prev.name = income?.name ?? '';
      prev.year = income?.year ?? new Date().getFullYear();
      if (income?.months) {
        prev.months = income.months;
      }
      return prev;
    });
  };
  
  const currentValue = (name: string, item?: Income, type: 'value' | 'month' | 'paid' =  'value') => {
    if (item && name) {
      if (name === 'source' && type === 'value') {
        return item.source?.id ?? '';
      }
      if (name === 'income' && type === 'value') {
        return item.name ?? '';
      }
      if (name === 'year' && type === 'value') {
        return item.year.toString();
      }
      if (type === 'month') {
        return item?.months?.find((month) => month.label === name)?.value.toString() ?? '';
      }
    }
    if (name === 'year') {
      return  new Date().getFullYear().toString();
    }
    if (type === 'month' ) {
      return '0';
    }
    return '';
  };
  
  const handleOnInput = ({ value, name }:OnInputParams) => {
    setFields((prev) => {
      if (name === 'year') {
        prev.year = convertToNumber(value);
      }
      if (name === 'source') {
        prev.source = { id: value } as IncomeSource;
        if (validatedInputs.source.invalid) {
          setValidatedInputs((prev) => ({ ...prev, source: { invalid: false, message: '' } }));
        }
      }
      if (name === 'income') {
        prev.name = value as string;
        if (validatedInputs.name.invalid) {
          setValidatedInputs((prev) => ({ ...prev, name: { invalid: false, message: '' } }));
        }
      }

      if (prev.months && prev.months.some(month => name === month.label) ) {
        const currentMonth = prev.months.find((item) => item.label === name);
        currentMonth!.value = convertToNumber(value);
        const currentMonthIndex = prev.months.findIndex((item) => item.label === name);
        prev.months[currentMonthIndex] = currentMonth!;
      }
      return prev;
    });
  };

  const handleValidatorForm = (fields: CreateIncomeParams) => {
    const field = { valid: true };
    if (isObjectEmpty(fields.source)) {
      setValidatedInputs((prev) => ({ ...prev, source: { invalid: true, message: 'Source is required' } }));
      field.valid = false;
    }
    if (!fields.name || fields.name === ''){
      setValidatedInputs((prev) => ({ ...prev, name: { invalid: true, message: 'Income name is required' } }));
      field.valid = false;
    }
    return {
      ...fields,
      valid: field.valid
    };
  };

  const switchChecked = ({ name, item }: CurrentValueParams) => {
    if (!name){
      return false;
    }
    
    const currentMonth = item?.months?.find((item) => item.label === name);
    if (!currentMonth) {
      return false;
    }
    return currentMonth.paid;
  };

  const handleOnSwitch = (checked: boolean, name?: string)  => {
    if (name) {
      setFields((prev) => {
        if (prev.months) {
          const currentMonth = prev.months.find((item) => item.label === name);
          currentMonth!.paid = checked;
          const currentMonthIndex = prev.months.findIndex((item) => item.label === name);
          prev.months[currentMonthIndex] = currentMonth!;
        }
        return prev;
      });
    }

  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { valid, ...params } = handleValidatorForm(fields);
    if (valid) {
      onSubmit(params ,income);
      onClose();
    }
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      initializeInputs(income);
    }
  }, []);

  return (
    <form className="income-persist" onSubmit={ handleSubmit }>
      <div>
        <Input
          id="income-persist-year"
          fluid
          name="year"
          type="number"
          value={currentValue('year', income)}
          onInput={handleOnInput}
          className="income-persist__row--item"
        />
        <Input
          type="select"
          name="source"
          label={t('income_source')}
          value={currentValue('source', income)}
          options={incomeSources.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          onInput={handleOnInput}
          validated={validatedInputs.source}
          className="income-persist__row--item"
          placeholder={ `${ t('enter_a') } ${ t('income_source') }` }
          autoComplete={true}
          fallbackLabel={`${ t('add') } ${ t('income_source') }`}
          fallbackAction={() => router.push('/incomes/sources')}
        />

        <Input
          type="text"
          name="income"
          label={t('income')}
          value={currentValue('income', income)}
          onInput={handleOnInput}
          validated={validatedInputs.name}
          className="income-persist__row--item"
          placeholder={ `${ t('enter_a') } ${ t('income') }` }/>

        {MONTHS.map((month) => (
          <div key={month} className="income-persist__row--month">
            <Input
              type="money"
              name={month}
              fluid={true}
              value={currentValue(month, income, 'month')}
              label={capitalize(t(month))}
              onInput={handleOnInput}
              className="income-persist__row--item"
              placeholder={ `${ t('enter_a') } ${ t('month') } ${t('value')}` }
            />
            <Switch
              label={capitalize(t(month))}
              checked={switchChecked({ name: month, item: income })}
              onChange={(_, checked ) => handleOnSwitch(checked, month)}
              className="income-persist__row--switch"
            >

            </Switch>
          </div>
        ))}
      </div>
      <div className="income-persist__actions">
        <Button context="error" appearance="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" context="success">Save</Button>
      </div>
    </form>
  );
}