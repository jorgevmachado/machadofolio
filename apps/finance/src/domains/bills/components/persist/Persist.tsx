'use client';

import React, { useEffect,useState } from 'react';

import { useRouter } from 'next/navigation';

import { snakeCaseToNormal } from '@repo/services';

import { type Bank, type Bill, type CreateBillParams, EBillType, type Group } from '@repo/business';

import { Button, Input, type OnInputParams } from '@repo/ds';

import './Persist.scss';

type PersistProps = {
    bill?: Bill;
    banks: Array<Bank>;
    groups: Array<Group>;
    onClose: () => void;
    onSubmit: (params: CreateBillParams, bill?: Bill) => void;
}

type PersistFields = CreateBillParams;

export default function Persist({ bill, banks, groups, onClose, onSubmit }: PersistProps) {
  const router = useRouter();
  const [fields, setFields] = useState<PersistFields>({
    year: new Date().getFullYear(),
    type: '' as EBillType,
    bank: '',
    group: '',
  });
  const currentValue = (name: string, item?: Bill) => {
    if (item && name) {
      if (name === 'type') {
        return item.type;
      }
      if (name === 'group') {
        return item.group?.id ?? '';
      }
      if (name === 'bank') {
        return item.bank?.id ?? '';
      }

      if (name === 'year') {
        return item.year.toString();
      }
    }
    if (name === 'year') {
      return bill?.year?.toString() ?? new Date().getFullYear().toString();
    }
    return '';
  };

  const handleOnInput = ({ value, name }:OnInputParams) => {
    setFields((prev) => {
      if (name === 'year') {
        prev.year = Number(value);
      }
      if (name === 'type') {
        prev.type = value as EBillType;
      }
      if (name === 'bank') {
        prev.bank = value as string;
      }
      if (name === 'group') {
        prev.group = value as string;
      }
      return prev;
    });
  };

  const handleValidatorForm = () => {};

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleValidatorForm();

    const params: CreateBillParams = {
      year: fields.year,
      type: fields.type,
      bank: fields.bank,
      group: fields.group,
    };
    onSubmit(params, bill);
    onClose();
  };

  useEffect(() => {
    if (bill) {
      setFields({
        year: bill.year,
        type: bill.type,
        bank: bill.bank?.id ?? '',
        group: bill.group?.id ?? '',
      });
    }
  }, []);

  return (
    <form className="bill-persist" onSubmit={handleSubmit}>
      <div className="bill-persist__row">
        <Input
          id="bill-persist-type"
          fluid
          name="type"
          type="select"
          value={currentValue('type', bill)}
          options={Object.values(EBillType).map((item) => ({
            value: item,
            label: snakeCaseToNormal(item),
          }))}
          onInput={handleOnInput}
          className="bill-persist__row--item"
          placeholder="Choose a Type"
        />
        <Input
          id="bill-persist-year"
          fluid
          name="year"
          type="number"
          value={currentValue('year', bill)}
          onInput={handleOnInput}
          className="bill-persist__row--item"
        />
      </div>
      <div className="bill-persist__row">
        <Input
          id="bill-persist-group"
          fluid
          name="group"
          type="select"
          value={currentValue('group', bill)}
          options={groups.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          onInput={handleOnInput}
          className="bill-persist__row--item"
          placeholder="Choose a Group"
          autoComplete
          fallbackLabel="Add Group"
          fallbackAction={() => router.push('/groups')}
        />
        <Input
          id="bill-persist-bank"
          name="bank"
          fluid
          type="select"
          value={currentValue('bank', bill)}
          options={banks.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          onInput={handleOnInput}
          className="bill-persist__row--item"
          placeholder="Choose a Bank"
          autoComplete
          fallbackLabel="Add Bank"
          fallbackAction={() => router.push('/banks')}
        />
      </div>
      <div className="bill-persist__actions">
        <Button context="error" appearance="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" context="success">Save</Button>
      </div>
    </form>
  );
}