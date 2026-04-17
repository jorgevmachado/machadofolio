import React from 'react';

import { type Bill } from '@repo/business';

import { Accordion ,Text } from '@repo/ds';

import { ExpensesList ,ExpensesProvider } from '../../../../expenses';
import { useBills } from '../../../hooks';

import ChildrenTitle from './children-title';

import './TabItem.scss';

type SubTabProps = {
  list: Array<Bill>;
};

export default function TabItem({ list }: SubTabProps) {

  const { getTitle, billListFilter } = useBills();

  const currentList = billListFilter(list, 'bank');

  return (
    <div className="tab-item" data-testid="tab-item">
      {currentList.map((item, index) => (
        <div key={item.title} className="tab-item__container" data-testid={`tab-item-container-${index}`}>
          <Text id={`list-card-accordion-title-${index}`} tag="h3" className="list-card__accordion--title">
            {item.title}
          </Text>
          {item.list.map((bill) => (
            <Accordion
              key={bill.id}
              title={getTitle(bill.name_code)}
              subtitle={bill.year.toString()}
              childrenTitle={<ChildrenTitle bill={bill} />}
            >
              <ExpensesProvider bill={bill}>
                <ExpensesList/>
              </ExpensesProvider>
            </Accordion>
          ))}
        </div>
      ))}
    </div>
  );
}