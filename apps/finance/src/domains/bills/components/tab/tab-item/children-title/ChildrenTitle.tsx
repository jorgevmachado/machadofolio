import { type Bill ,EBillType } from '@repo/business';

import { Icon, Text } from '@repo/ds';

import { useBills } from '../../../../hooks';

import './ChildrenTitle.scss';

type ChildrenTitleProps = {
  bill: Bill
}

export default function ChildrenTitle({ bill }: ChildrenTitleProps){

  const {
    getTitle,
    handleOpenDeleteModal,
    handleUploadFilesModal
  } = useBills();

  const showUpload = bill.bank.name_code === 'nubank' && bill.type === EBillType.CREDIT_CARD;

  return (
    <div className="children-title">
      <Text>{getTitle(bill.name_code)}</Text>
      <Icon
        icon="trash"
        onClick={(e) => {
          e.stopPropagation();
          handleOpenDeleteModal(bill);
        }}
      />
      {showUpload && (
        <Icon
          icon="upload"
          onClick={(e) => {
            e.stopPropagation();
            handleUploadFilesModal(bill);
          }}
        />
      )}
    </div>
  );

}