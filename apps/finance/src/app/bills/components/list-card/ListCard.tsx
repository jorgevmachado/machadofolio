'use client'
import { Bill, Supplier } from '@repo/business';

import { Accordion, Icon, Text } from '@repo/ds';

import { billBusiness } from '../../../shared';

import Expenses from '../expenses';

import './ListCard.scss';


type ListCardProps = {
    list: Array<Bill>;
    suppliers: Array<Supplier>;
}
export default function ListCard({ list , suppliers }: ListCardProps) {
    const currentList = billBusiness.mapBillListByFilter(list, 'bank');
    const handleOpenModal = (item?: Bill) => {}

    const renderChildrenTitle = (bill: Bill) => {
        return (
            <div className="list-card__accordion--title">
                <Text>{bill.name}</Text>
                <Icon
                    icon="edit"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(bill);
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
                            <Expenses bill={bill} suppliers={suppliers} />
                        </Accordion>
                    ))}
                </div>
            ))}
        </div>
    )
}