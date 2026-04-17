import React ,{ useEffect ,useRef ,useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  convertToNumber ,
  type EMonth ,
  MONTHS ,
  type ValidatorParams,
} from '@repo/services';

import { Button ,Input ,type OnInputParams ,Switch } from '@repo/ds';

import type {
  CreateExpenseParams ,
  EExpenseType ,
  Expense ,UpdateExpenseParams ,
} from '@repo/business';

import { useFinance } from '../../../finances';
import type {
  OnSubmitParams
} from '../../hooks';

import { getInputGroup } from './config';
import {
  DEFAULT_PERSIST_FORM
} from './config';
import type { CurrentValueParams, InputGroup ,InputGroupItem, PersistForm } from './types';

import './Persist.scss';

type PersistProps = {
  onClose: () => void;
  expense?: Expense;
  onSubmit: (params: OnSubmitParams) => void;
}

export default function Persist({ onClose, expense, onSubmit }: PersistProps) {
  const isMounted = useRef(false);
  const router = useRouter();

  const { suppliers } = useFinance();

  const [inputGroups, setInputGroups] = useState<Array<InputGroup>>([]);
  const [inputs, setInputs] = useState<Array<InputGroupItem>>([]);
  const [persistForm, setPersistForm] = useState<PersistForm>(DEFAULT_PERSIST_FORM);

  const currentValue = ({ name, type, item }: CurrentValueParams ): string => {
    if (item && name) {
      const currentValue = item?.[name as keyof Expense];
      if (type === 'select' && name === 'supplier') {
        return (currentValue as { id?: string })?.id ?? '';
      }
      return typeof currentValue === 'string' ? currentValue : String(currentValue ?? '');
    }
    return '';
  };

  const initializeInputs = (type?: EExpenseType) => {
    const inputGroups = getInputGroup(!expense, type);
    const currentInputGroups = inputGroups.map((group) => ({
      ...group,
      inputs: group.inputs.map((input) => {
        const currentInput = {
          ...input,
          value: currentValue({ name: input.name, item: expense, type: input.type }),
        };

        if (input.name === 'supplier') {
          return {
            ...currentInput,
            options: suppliers.map((supplier) => ({ value: supplier.id, label: supplier.name })),
          };
        }
        return currentInput;
      })
    }));
    setInputGroups(currentInputGroups);
    const inputs = currentInputGroups.flatMap((group) => group.inputs);
    setInputs(inputs);
    const initialAccumulator = {
      fields: { ...persistForm.fields },
      errors: { ...persistForm.errors },
    };

    const { fields, errors } = inputs.reduce((acc, input) => {
      if (expense) {
        acc.fields.id = expense.id;
      }
      if (input.value && input.value !== '') {
        acc.fields[input.name as keyof PersistForm['fields']] = input.value as string;
      }
      acc.errors[input.name as keyof PersistForm['errors']] = undefined;
      if (input.validator && Boolean(expense)) {
        acc.errors[input.name as keyof PersistForm['errors']] = input?.validator({
          value: (acc.fields as PersistForm['fields'])[input.name as keyof PersistForm['fields']]
        });
      }
      return acc;
    }, initialAccumulator);

    setPersistForm((prev) => ({ ...prev, fields, errors }));
  };

  const handleOnInput = ({ value, name }: OnInputParams) => {
    setPersistForm((prev) => ({
      ...prev,
      fields: { ...prev.fields, [name]: value }
    }));
  };

  const handleValidatorForm = () => {
    const persistFormDraft = { ...persistForm };
    const { valid, errors, messages, updatedInputs } = inputs.reduce((acc, input) => {
      const value = persistFormDraft.fields[input.name as keyof PersistForm['fields']];
      const validatorMessage = input.validator
        ? input.validator?.({ value: value })
        : { valid: true, message: '' };
      const inputValid = validatorMessage?.valid;
      const message = `${input.label}: ${validatorMessage?.message}`;
      input.validated = { invalid: !inputValid, message };
      if (!inputValid) {
        acc.valid = false;
        acc.messages.push(message);
      }
      acc.errors[input.name as keyof PersistForm['errors']] = validatorMessage;
      acc.updatedInputs.push(input);
      return acc;
    }, {
      valid: true,
      errors: { ...persistFormDraft.errors },
      messages: [] as Array<string>,
      updatedInputs: [] as Array<InputGroupItem>
    });

    persistFormDraft.valid = valid;
    persistFormDraft.errors = errors;
    persistFormDraft.message = messages
      .map((message) => `   ${message}`)
      .join('\n');
    setPersistForm(persistFormDraft);
    setInputs(updatedInputs);
  };

  const handleValidator = (input: Omit<InputGroupItem, 'show'>, params: ValidatorParams) => {
    if (!input.validator) {
      return {
        valid: true,
        message: ''
      };
    }
    return input.validator(params);
  };

  const switchChecked = ({ name }: Omit<CurrentValueParams, 'type'>) => {
    if (!name) {
      return false;
    }
    if (name === 'paid') {
      return persistForm?.fields?.paid === 'true';
    }

    if (MONTHS.some(month => name === `${month}_paid`)) {
      return persistForm?.fields?.[name as keyof PersistForm['fields']] === 'true';
    }

    return false;

  };

  const handleOnSwitch = (checked: boolean, name?: string)  => {
    if (name) {
      setPersistForm((prev) => {
        const newFields = { ...prev.fields };
        newFields[name as keyof PersistForm['fields']] = `${checked}`;

        if (name === 'paid') {
          MONTHS.forEach((month) => {
            newFields[`${month}_paid`] = `${checked}`;
          });
        }
        if (name.endsWith('_paid') && !checked) {
          newFields['paid'] = 'false';
        }
        if (name.endsWith('_paid') && checked) {
          const allMonthsPaid = MONTHS.every(
            (month) => (
              name === `${month}_paid` ? checked : prev.fields[`${month}_paid`] === 'true'
            )
          );
          if (allMonthsPaid) {
            newFields['paid'] = 'true';
          }
        }

        return {
          ...prev,
          fields: newFields
        };
      });
    }

  };

  const fallbackAction = (name: string) => {
    switch (name) {
      case 'supplier':
        router.push('/suppliers');
        break;
      default:
        break;
    }
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleValidatorForm();
    const fields = persistForm.fields;
    const create: CreateExpenseParams = {
      type: fields?.type as EExpenseType,
      paid: fields?.paid === 'true',
      value: convertToNumber(fields?.value),
      month: fields?.month as EMonth,
      supplier: fields?.supplier ?? '',
      description: fields?.description,
      instalment_number: convertToNumber(fields?.instalment_number),
    };
    const update: UpdateExpenseParams = {
      ...expense,
      type: fields?.type ? fields?.type as EExpenseType : expense?.type,
      paid: fields?.paid ? fields?.paid === 'true' : expense?.paid,
      supplier: fields?.supplier ?? expense?.supplier,
      description: fields?.description ?? expense?.description,
    };
    if (expense?.months && expense?.months?.length > 0) {
      update.months = expense.months.map((item) => {
        item.value = convertToNumber(fields[item.label] as string);
        item.paid = fields[`${item.label}_paid` as keyof PersistForm['fields']] === 'true';
        return item;
      });
    }
    onSubmit?.({ create, update, expense });
    onClose();
  };

  
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      const type = expense?.type;
      initializeInputs(type);
    }
  }, []);

  useEffect(() => {
    if (persistForm.fields.type){
      initializeInputs(persistForm?.fields?.type as EExpenseType);
    }
  }, [persistForm.fields?.type]);
  
  return (
    <form onSubmit={handleSubmit} className="persist">
      {inputGroups?.map((group) => (
        <div key={group.id} className={group?.className ?? 'persist__row'}>
          {group.inputs.map(({ show, ...input }) => (
            <React.Fragment key={input.name}>
              {show && input.label !== 'Paid' && (
                <Input
                  {...input}
                  onInput={handleOnInput}
                  className={input.className ?? 'persist__row--item'}
                  validator={(params) => handleValidator(input, params)}
                  fallbackAction={fallbackAction}
                />
              )}
              {show && input.label === 'Paid' && (
                <Switch
                  label={input.label}
                  checked={switchChecked({ name: input.name, item: expense })}
                  onChange={(_, checked ) => handleOnSwitch(checked, input.name)}
                  className="persist__row--switch"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      ))}
      <div className="persist__actions">
        <Button context="error" appearance="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" context="success">Save</Button>
      </div>
    </form>
  );
}