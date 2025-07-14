import React, { useState } from 'react';

import { Icon } from '@repo/ds';

import { type TRoute } from '../../../utils';
import { formatPath } from '@repo/services';


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
    return (
        <div className="ui-dropdown">
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
                                    className="ui-dropdown__submenu--link"
                                    onClick={() => onLinkClick(formatPath({ parentPath: menu.path, childPath: child.path, grandParentPath }))
                                }>

                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}