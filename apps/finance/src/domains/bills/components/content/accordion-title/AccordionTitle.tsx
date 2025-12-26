import { useMemo } from 'react';

import { normalize ,toSnakeCase } from '@repo/services';

import { type Bank ,type BillList ,type Group } from '@repo/business';

import { Icon } from '@repo/ds';

import { useBills } from '../../../hooks';

type AccordionTitleProps = {
  billLIst: BillList
}

export default function AccordionTitle({ billLIst }: AccordionTitleProps) {

  const { handleUploadCreditCardNubankModal } = useBills();

  const group = useMemo(() => {
    const groupName = toSnakeCase(normalize(billLIst.title));
    const groups = billLIst.list.map((item) => item.group);
    return groups.find((item) => item.name_code.toUpperCase() === groupName.toUpperCase()) as Group;
  },[billLIst.list, billLIst.title]);

  const bank = useMemo(() => {
    const banks = billLIst.list.map((item) => item.bank);
    return banks.find((item) => item.name_code.toUpperCase() === 'NUBANK') as Bank;
  },[billLIst.list]);

  const showCreditCardUpload = useMemo(() => {
    const isBillCreditCard = billLIst.list.find((item) => item.type === 'CREDIT_CARD');
    if (!isBillCreditCard){
      const isBillNubankCreditCard = billLIst.list.find((item) => item.bank.name_code.toUpperCase() === 'NUBANK');
      return !!isBillNubankCreditCard;
    }

    return false;


  }, [billLIst.list]);
  return showCreditCardUpload ?(
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ marginRight: '0.8rem' }}>{billLIst.title}</div>
      <Icon
        icon="upload"
        onClick={(e) => {
          e.stopPropagation();
          handleUploadCreditCardNubankModal(group, bank);
        }}
      />
    </div>
  ): billLIst.title;
};