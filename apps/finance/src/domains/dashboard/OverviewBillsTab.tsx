import { useMemo } from 'react';

import { type Bill ,EBillType } from '@repo/business';

import OverviewBillsTable from './OverviewBillsTable';

type OverviewBillsTabProps = {
  list: Array<Bill>;
};

export default function OverviewBillsTab({ list }: OverviewBillsTabProps) {

  const types = useMemo(() => {
    return {
      creditCard: {
        label: 'credit_card',
        list: list.filter((item) => item.type === EBillType.CREDIT_CARD)
      },
      bankSlip: {
        label: 'bank_slip',
        list: list.filter((item) => item.type === EBillType.BANK_SLIP)
      },
      pix: {
        label: 'pix',
        list: list.filter((item) => item.type === EBillType.PIX)
      },
      accountDebit: {
        label: 'account_debit',
        list: list.filter((item) => item.type === EBillType.ACCOUNT_DEBIT)
      }
    };
  }, [list]);


  return (
    <>
      { types.creditCard.list.length > 0 && (
        <OverviewBillsTable bills={types.creditCard.list} label={types.creditCard.label}/>
      )}
      { types.bankSlip.list.length > 0 && (
        <OverviewBillsTable bills={types.bankSlip.list} label={types.bankSlip.label}/>
      )}
      { types.pix.list.length > 0 && (
        <OverviewBillsTable bills={types.pix.list} label={types.pix.label}/>
      )}
      { types.accountDebit.list.length > 0 && (
        <OverviewBillsTable bills={types.accountDebit.list} label={types.accountDebit.label}/>
      )}
    </>
  );
}
