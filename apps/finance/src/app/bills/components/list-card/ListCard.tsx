'use client'
import { snakeCaseToNormal } from '@repo/services';

import { type Bill, EBillType } from '@repo/business';

import { Accordion, Icon, Text } from '@repo/ds';

import { useI18n } from '@repo/i18n';

import ExpensesProvider from '../../../../hooks/expenses/ExpensesProvider';
import { billBusiness } from '../../../../shared';

import Expenses from '../expenses';

import './ListCard.scss';

type ListCardProps = {
    list: Array<Bill>;
    handleOpenDeleteModal: (item?: Bill) => void;
    handleUploadFileModal: (item: Bill) => void;
}
export default function ListCard({ list, handleOpenDeleteModal, handleUploadFileModal }: ListCardProps) {
    const { t } = useI18n();
    const currentList = billBusiness.mapBillListByFilter(list, 'bank');

    const accordionTitle = (title: string) => {
        const newTitle = title
            .replaceAll('pix', t('pix'))
            .replaceAll('bank_slip', t('bank_slip'))
            .replaceAll('credit_card', t('credit_card'))
            .replaceAll('account_debit', t('account_debit'));
        return snakeCaseToNormal(newTitle);
    }

    const renderChildrenTitle = (bill: Bill) => {
        const showUpload = bill.bank.name_code === 'nubank' && bill.type === EBillType.CREDIT_CARD;
        return (
            <div className="list-card__accordion--title">
                <Text>{accordionTitle(bill.name_code)}</Text>
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
                            handleUploadFileModal(bill);
                        }}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="list-card" data-testid="list-card">
            {currentList.map((item, index) => (
                <div key={item.title} className="list-card__accordion">
                    <Text id={`list-card-accordion-title-${index}`} tag="h3" className="list-card__accordion--title">
                        {item.title}
                    </Text>
                    {item.list.map((bill) => (
                        <Accordion
                            key={bill.id}
                            title={accordionTitle(bill.name_code)}
                            subtitle={bill.year?.toString()}
                            childrenTitle={renderChildrenTitle(bill)}
                        >
                            <ExpensesProvider bill={bill}>
                                <Expenses bill={bill}/>
                            </ExpensesProvider>
                        </Accordion>
                    ))}
                </div>
            ))}
        </div>
    )
}