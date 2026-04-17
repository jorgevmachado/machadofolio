import React, { useState } from 'react';

import { joinClass, type TContext } from '../../utils';

import './Tabs.scss';

type TabItem = {
    title: React.ReactNode | string;
    children: React.ReactNode;
}

type TabsProps = {
    items: Array<TabItem>;
    fluid?: boolean;
    context?: TContext;
    'data-testid'?: string;
}

export default function Tabs({ items, fluid, context = 'primary', 'data-testid': dataTestId = 'ds-tabs' }: TabsProps) {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const classNameList = joinClass([
        'ds-tabs',
        fluid && 'ds-tabs__fluid',
        context && `ds-tabs__context--${context}`,
    ]);

    const onClickTab = (index: number) => {
        setActiveIndex(index);
    }

    const tabsItemClassNameList = (index: number, activeIndex: number) => joinClass([
        'ds-tabs__item',
        activeIndex === index && 'ds-tabs__item--active',
    ])

    return (
        <div className={classNameList} data-testid={dataTestId}>
            <ul className="ds-tabs__list" data-testid={`${dataTestId}-list`}>
                {items.map((item, index) => (
                    <li
                        key={`ds-tabs-item-${index}`}
                        role="tab"
                        onClick={() => onClickTab(index)}
                        tabIndex={activeIndex === index ? 0 : -1}
                        className={tabsItemClassNameList(index, activeIndex)}
                        data-testid={`${dataTestId}-item-${index}`}
                        aria-selected={activeIndex === index}
                    >
                        {item.title}
                    </li>
                ))}
            </ul>
            { items[activeIndex]?.children && (
                <div role="tabpanel" className="ds-tabs__content" data-testid={`${dataTestId}-content-${activeIndex}`}>
                    {items[activeIndex]?.children}
                </div>
            )}
        </div>
    );
};
