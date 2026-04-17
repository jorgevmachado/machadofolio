import React ,{ useCallback ,useMemo } from 'react';

import { MONTHS ,truncateString } from '@repo/services';

import { type Bill ,EExpenseType ,type ExpenseWithMonthsAndPaid  } from '@repo/business';

import { ETypeTableHeader ,Table ,type TColors,Text } from '@repo/ds';

import { useI18n } from '@repo/i18n';

import { expenseBusiness } from '../../shared';

import type { TableProps } from '../expenses/hooks/types';

type OverviewBillsTableProps = {
  bills: Array<Bill>;
  label: string;
}

type MonthResult = {
  total: number;
  paid: boolean;
};

export default function OverviewBillsTable({ bills, label }:OverviewBillsTableProps) {
  const { t } = useI18n();

  const headers = useMemo(() => {
    const monthHeaders: TableProps['headers'] = MONTHS.map((month) => ({
      text: truncateString(t(month), 3),
      type: ETypeTableHeader.MONEY,
      value: month,
      conditionColor: {
        value: `${month}_paid`,
        trueColor: 'success-80' as TColors,
        falseColor: 'error-80' as TColors,
      },
    }));
    return [
      ...monthHeaders,
      { text: 'Total', value: 'total', type: ETypeTableHeader.MONEY },
    ];
  }, [t]);

  const generateExpenseWithMonthsAndPaid = useCallback((bill: Bill) => {
    const expenses = bill.expenses ?? [];
    const result = expenses?.map((expense) => expenseBusiness.convertMonthsToObject(expense));
    const monthlySummary = MONTHS.reduce((acc, month) => {
      const values = result?.flatMap((item) => item[month]) ?? [];
      const valuesPaid = result?.flatMap((item) => item[`${month}_paid`]) ?? [];
      const total = values.reduce((acc, month) => acc + month, 0);
      const paid = valuesPaid.every((v) => v);
      acc[month] = { total, paid };
      return acc;
    }, {} as Record<string, MonthResult>);
    const item: Omit<ExpenseWithMonthsAndPaid, 'supplier'> = {
      january: 0,
      january_paid: false,
      february: 0,
      february_paid: false,
      march: 0,
      march_paid: false,
      april: 0,
      april_paid: false,
      may: 0,
      may_paid: false,
      june: 0,
      june_paid: false,
      july: 0,
      july_paid: false,
      august: 0,
      august_paid: false,
      september: 0,
      september_paid: false,
      october: 0,
      october_paid: false,
      november: 0,
      november_paid: false,
      december: 0,
      december_paid: false,
      bill,
      created_at: bill.created_at ,
      id: '' ,
      instalment_number: 0 ,
      name: '' ,
      name_code: '' ,
      paid: false ,
      total: 0 ,
      total_paid: 0 ,
      type: EExpenseType.FIXED ,
      updated_at: bill.updated_at ,
      year: 0
    };
    MONTHS.forEach((month) => {
      item[month] = monthlySummary[month]?.total ?? 0;
      item[`${month}_paid`] = monthlySummary[month]?.paid ?? false;
    });
    return item;
  }, []);

  const results = useMemo(() => {
    return bills.map((bill) => {
      const monthlySummary = generateExpenseWithMonthsAndPaid(bill);
      monthlySummary.total = MONTHS.reduce((acc, month) => {
        acc += monthlySummary[month];
        return acc;
      }, 0);
      return monthlySummary;
    });
  }, [bills, generateExpenseWithMonthsAndPaid]);


  return (
    <div  style={{ marginBottom: '2rem' }}>
      <Text color="info-80" variant="large">{t(label)}</Text>
      <Table
        headers={ headers }
        items={ results }
      />
    </div>
  );
}