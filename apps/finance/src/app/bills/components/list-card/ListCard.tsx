'use client'
import { Bill } from '@repo/business';

import { Accordion, Icon, Text } from '@repo/ds';

import { billBusiness } from '../../../../shared';

import Expenses from '../expenses';

import './ListCard.scss';


type ListCardProps = {
    list: Array<Bill>;
    handleOpenDeleteModal: (item?: Bill) => void;
    handleUploadFileModal: (item: Bill) => void;
}
export default function ListCard({ list, handleOpenDeleteModal, handleUploadFileModal }: ListCardProps) {
    const currentList = billBusiness.mapBillListByFilter(list, 'bank');

    const renderChildrenTitle = (bill: Bill) => {
        return (
            <div className="list-card__accordion--title">
                <Text>{bill.name}</Text>
                <Icon
                    icon="trash"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDeleteModal(bill);
                    }}
                />
                <Icon
                    icon="upload"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUploadFileModal(bill);
                    }}
                />
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
                            title={bill.name}
                            subtitle={bill.year?.toString()}
                            childrenTitle={renderChildrenTitle(bill)}
                        >
                            <Expenses bill={bill} />
                        </Accordion>
                    ))}
                </div>
            ))}
        </div>
    )
}