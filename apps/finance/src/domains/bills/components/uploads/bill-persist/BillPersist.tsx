import React ,{ useEffect ,useMemo ,useState } from 'react';

import { type Bill ,type BillList } from '@repo/business';

import { Input ,type OnInputParams } from '@repo/ds';

type BillPersistProps = {
  billList: Array<BillList>;
  updateBill: (bill: Bill) => void;
};

export default function BillPersist({ billList, updateBill }: BillPersistProps){
  const [selectedFile, setSelectedFile] = useState<BillList | undefined>(undefined);
  const [disabledFile, setDisabledFile] = useState<boolean>(false);

  const [billListBank, setBillListBank] = useState<Array<BillList>>([]);
  const [selectedBillBank, setSelectedBillBank] = useState<BillList | undefined>(undefined);
  const [disabledBillBank, setDisabledBillBank] = useState<boolean>(false);

  const [billListType, setBillListType] = useState<Array<BillList>>([]);
  const [selectedBillType, setSelectedBillType] = useState<BillList | undefined>(undefined);

  const [readyToUpdate, setReadyToUpdate] = useState<boolean>(false);

  const billGroup = useMemo(() => {
    return billList.map((item) => item.title);
  }, [billList]);

  const billBank = useMemo(() => {
    if (!billListBank) {
      return [];
    }
    return billListBank.map((item) => item.title);
  }, [billListBank]);

  const billType = useMemo(() => {
    if (!billListType) {
      return [];
    }
    return billListType.map((item) => item.title);
  }, [billListType]);


  useEffect(() => {
    if (readyToUpdate && selectedBillType) {
      const billToUpdate = selectedBillType?.list[0];
      if (billToUpdate) {
        updateBill(billToUpdate);
      }
    }
  } ,[readyToUpdate, selectedBillType, updateBill]);

  const handleOnInput = ({ value, name }:OnInputParams) => {
    if (name === 'file')  {
      setDisabledFile(true);
    }
  };

  const currentValue = (name: string, item?: Array<string>) => {
    return '';
  };

  return (
    <div>
      <Input
        id="bill-persist-upload-file"
        fluid
        name="file"
        type="select"
        value={currentValue('file', billGroup)}
        options={billGroup.map((item) => ({
          value: item,
          label: item,
        }))}
        onInput={handleOnInput}
        disabled={disabledFile}
        className="bill-persist__row--item"
        placeholder="Choose a File"
      />
    </div>
  );
}