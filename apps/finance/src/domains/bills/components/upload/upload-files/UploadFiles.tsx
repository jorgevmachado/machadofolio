import React, { useEffect, useState } from 'react';

import { type EMonth, getMonthByIndex, MONTHS } from '@repo/services';

import { Input, type OnFileInputChangeParams, type OptionsProps, Switch, Table } from '@repo/ds';

import { type UploadListItem } from '../types';

type UploadFilesProps = {
  uploads: Array<UploadListItem>;
  updateUploads: (uploads: Array<UploadListItem>) => void;
}

type FormItem = {
  index: number;
  paid: React.ReactNode;
  month: React.ReactNode;
  fileName: string;
}

type ListItemMonth = {
  index: number;
  value: string;
}

type ListItem = {
  index: number;
  paid: boolean;
  file: string;
  month: ListItemMonth;
  fileName: string;
}

type BuildComponentParams = {
  file: string;
  paid?: boolean;
  index: number;
  month?: string;
  fileName: string;
}

export default function UploadFiles({ uploads, updateUploads }: UploadFilesProps) {
  const [formList, setFormList] = useState<Array<FormItem>>([]);
  const [list, setList] = useState<Array<ListItem>>([]);
  const [months] = useState<Array<OptionsProps>>(MONTHS.map((item) => ({
    value: item.toUpperCase(),
    label: item,
  })));

  const handleOnInput = (index: number, name: string, value: string | boolean) => {
    setList((prevState) => prevState.map((item, i) => {
      if (i === index) {
        switch (name) {
          case 'paid':
            item.paid = value as boolean;
            break;
          case 'month':
            item.month = buildMonth({ month: value as string });
            break;
        }
      }
      return item;
    }));
  };

  const handleMonthChange = (index: number, newMonth: string) => {
    setList((prevState) => prevState.map((item, i) => {
      if (i === index) {
        const monthIndex = MONTHS.findIndex(m => m.toUpperCase() === newMonth);
        item.month.index = monthIndex;
        item.month.value = MONTHS[monthIndex] ?? '';
      }
      return item;
    }));
  };

  const renderInputMonth = (index: number, monthItem: ListItemMonth, list: Array<ListItem>) => {
    const month = monthItem.value.toUpperCase();

    const currentMonths = list
      .filter((item) => item.index !== index) // Exclui o item atual
      .map((item) => item.month?.value?.toLowerCase())
      .filter(Boolean);

    const monthsFiltered = months.filter(
      (item) => !currentMonths.includes(item.value.toLowerCase())
    );

    const options = month && !monthsFiltered.some(m => m.value === month)
      ? [...monthsFiltered, months.find(m => m.value === month)].filter(Boolean) as Array<OptionsProps>
      : monthsFiltered;

    const inputName = `month_${index}`;
    return (
      <Input
        id={`select_month_${index}`}
        key={inputName}
        type="select"
        name={inputName}
        value={month}
        options={options}
        required
        placeholder="Choose a Month"
        onInput={({ value }) => handleMonthChange(index, value as string)}
      />
    );
  };

  const renderInputPaid = (index: number, paid: boolean = false) => {
    return (
      <Switch
        key={index}
        label="Paid"
        checked={list[index]?.paid ?? paid}
        onChange={(_, checked) => handleOnInput(index, 'paid', checked)}
      />
    );
  };

  const getMonthIndex = ({ month, fileName } : { month?: string, fileName?: string }) => {
    if (month) {
      return MONTHS.findIndex(m => m.toUpperCase() === month.toUpperCase());
    }
    if (fileName) {
      const fileDateString = fileName.replaceAll('Nubank_', '').replaceAll('.xlsx', '');
      const fileDate = new Date(fileDateString);
      return fileDate.getMonth();
    }
    return Number('abc');
  };

  const buildMonth = (params : { month?: string, fileName?: string }) => {
    const index = getMonthIndex(params);
    if (isNaN(index)) {
      return {
        index: -1,
        value: ''
      };
    }
    return {
      index,
      value: getMonthByIndex(index) as string
    };
  };

  const buildFormList = (list: Array<ListItem> = []): Array<FormItem> => {
    return list.map((item) => buildFormListItem(item, list));
  };

  const buildFormListItem = (item: ListItem, list: Array<ListItem> = []): FormItem => {
    const { index, paid, month, fileName } = item;
    return {
      index,
      paid: renderInputPaid(index, paid),
      month: renderInputMonth(index, month, list),
      fileName
    };
  };

  const handleOnChangeFile = ({ files }: OnFileInputChangeParams) => {
    buildComponent(files?.map((file, index) => ({
      file: file.value,
      paid: false,
      index,
      fileName: file.fileName
    })));
  };

  const buildComponent = (params: Array<BuildComponentParams> = []) => {
    const currentList: Array<ListItem> = [];
    const currentFormList: Array<FormItem> = [];
    params.forEach((item) => {
      const month = buildMonth({ month: item.month, fileName: item.fileName });
      const itemList = {
        index: item.index,
        paid: Boolean(item.paid),
        file: item.file,
        month,
        fileName: item.fileName
      };
      currentList.push(itemList);
      const formItem = buildFormListItem(itemList, currentList);
      currentFormList.push(formItem);
    });
    setList(currentList);
    setFormList(currentFormList);
  };

  const validateForm = () => {
    return list.every((item) => item.month.index !== -1);
  };

  const handleUpdateUploads = (list: Array<ListItem>) => {
    updateUploads(list.map((item) => ({
      index: item.index,
      file: item.file,
      paid: item.paid,
      month: item.month.value as EMonth,
      fileName: item.fileName
    })));
  };

  useEffect(() => {
    if (list.length > 0) {
      const updatedFormList = buildFormList(list);
      setFormList(updatedFormList);
      const formValid = validateForm();
      if (formValid) {
        handleUpdateUploads(list);
      }
    }
  }, [list]);

  useEffect(() => {
    if (uploads.length > 0) {
      buildComponent(uploads.map((item) => ({
        file: item.file,
        paid: item.paid,
        index: item.index,
        month: item.month,
        fileName: item.fileName
      })));
    }
  }, []);

  return (
    <>
      <div className="upload-files__file">
        <Input
          id="file"
          key="file"
          name="file"
          fluid
          type="file"
          accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          multiple
          disabled={formList.length > 0}
          onChangeFile={handleOnChangeFile}
        />
      </div>
      {formList.length > 0 && (
        <div>
          <Table
            items={formList}
            headers={[
              {
                text: 'Arquivo',
                value: 'fileName',
              },
              {
                text: 'Mes',
                value: 'month',
              },
              {
                text: 'Pago',
                value: 'paid',
              }
            ]}
          />
        </div>
      )}
    </>
  );
}