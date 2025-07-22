import React, { useState } from 'react';

import { formatPath } from '@repo/services';

import { Icon } from '@repo/ds';

import { type TRoute } from '../../../utils';

import './Dropdown.scss';

type DropdownProps = {
    menu: TRoute;
    isOpen: boolean;
    onLinkClick: (path: string) => void;
    grandParentPath?: string;
};

export default function Dropdown({ menu, isOpen, onLinkClick, grandParentPath }: DropdownProps) {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const toggleExpand = (item: string) => {
        setExpandedItem(expandedItem === item ? null : item);
    };

    const abbrTitle = (title: string) =>
        title
            .split('-')
            .map((part) => part.charAt(0).toUpperCase())
            .join('');

    return (
        <div className="ui-dropdown" data-testid="ui-dropdown">
            <div className="ui-dropdown__menu" onClick={() => toggleExpand(menu.title)}>
                <Icon icon={menu.icon}/>
                {isOpen && (
                    <div className="ui-dropdown__menu--title">
                        <span className="ui-dropdown__menu--title-text">
                          {menu.title}
                        </span>
                        <Icon icon={expandedItem === menu.title ? 'chevron-up' : 'chevron-down'}/>
                    </div>
                )}
            </div>
            {expandedItem === menu.title && menu.children && (
                <div className="ui-dropdown__submenu">
                    { menu.children.map((child) => (
                        <div key={child.key}>
                            {child.children ? (
                                <Dropdown
                                    menu={child}
                                    isOpen={isOpen}
                                    onLinkClick={onLinkClick}
                                    grandParentPath={grandParentPath}
                                />
                            ) : (
                                <div
                                    key={child.title}
                                    onClick={() => onLinkClick(formatPath({ parentPath: menu.path, childPath: child.path, grandParentPath }))}
                                    data-testid="ui-dropdown-submenu-link"
                                    className="ui-dropdown__submenu--link"
                                    >
                                    {isOpen ? (
                                        <>
                                            <Icon icon={child.icon} />
                                            <span className="ui-dropdown__submenu--link-title">{child.title}</span>
                                        </>
                                    ) : (
                                        <span className="ui-dropdown__submenu--link-abbr" data-testid="ui-dropdown-submenu-link">
                                            { child.icon ? <Icon icon={child.icon} /> : abbrTitle(child.title)}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}