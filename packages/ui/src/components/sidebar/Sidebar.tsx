import React, { useEffect, useState } from 'react';

import { Icon, joinClass,Text } from '@repo/ds';

import { type TranslatorFunction } from '@repo/i18n';

import { type TRoute } from '../../utils';

import Dropdown from './dropdown';

import './Sidebar.scss';

type SidebarProps = {
    menu: Array<TRoute>;
    logout?: TRoute;
    onToggle?: (value: boolean) => void;
    translator?: TranslatorFunction;
    onLinkClick?: (path: string) => void;
    isSidebarOpen?: boolean;
}

export default function Sidebar({ menu, logout, onToggle, translator, onLinkClick, isSidebarOpen }: SidebarProps) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    useEffect(() => {
        setIsOpen(Boolean(isSidebarOpen));
    }, [isSidebarOpen]);

    const handleOnClick = (path: string) => {
        if(onLinkClick) {
            onLinkClick(path);
            return;
        }
        if(window !== undefined) {
            window.location.href = path;
        }
    };

    const toggleSidebar = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if(onToggle) {
            onToggle(newState);
        }
    };

    const classNameList = joinClass([
        'ui-sidebar',
        isOpen ? 'ui-sidebar__open' : 'ui-sidebar__closed',
    ]);

    return (
        <div className={classNameList} data-testid="ui-sidebar">
            <button className="ui-sidebar__toggle-button" onClick={toggleSidebar}>
                <Icon icon={isOpen ? 'chevron-left' : 'chevron-right'} />
            </button>
            <div className="ui-sidebar__menu">
                {menu?.map((item) => (
                    <div key={item.key} className="ui-sidebar__menu--item">
                        {!item.children
                            ? (
                                <div className="ui-sidebar__menu--item-link" onClick={() => handleOnClick(item.path)}>
                                    <Icon icon={item.icon}/>
                                    {isOpen && (
                                        <>
                                            <Text
                                                tag="span"
                                                name={item.name}
                                                variant="medium"
                                                translator={translator}
                                                className="ui-sidebar__menu--item-link__title">
                                                {item.title}
                                            </Text>
                                        </>
                                    )}
                                </div>
                            )
                            : (
                                <Dropdown menu={item} isOpen={isOpen} onLinkClick={handleOnClick} translator={translator}/>
                            )
                        }
                    </div>
                ))}

                {logout && (
                    <div className="ui-sidebar__menu--item ui-sidebar__menu--item-logout" data-testid="ui-sidebar-logout">
                        <div className="ui-sidebar__menu--item-link" onClick={() => handleOnClick(logout.path)}>
                            <Icon icon={logout.icon}/>
                            {isOpen && (
                                <Text
                                    tag="span"
                                    name={logout.name}
                                    variant="medium"
                                    className="ui-sidebar__menu--item-link__title"
                                    translator={translator}
                                    data-testid="ui-sidebar-logout-title">
                                    {logout.title}
                                </Text>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};