import React from 'react';

import { Button, Dropdown, Image, Link, type TContext, type TIcon } from '@repo/ds';

import './Header.scss';

interface TLogo extends React.HTMLAttributes<HTMLDivElement>  {
    src: string;
    alt: string;
    title: string;
    width?: number;
    height?: number;
}

type TNavbarItem = {
    key: string;
    icon?: TIcon;
    href?: string;
    label: string;
    items?: Array<TNavbarItem>;
    counter?: number;
    onRedirect?: () => void;
}

type HeaderProps = {
    logo?: TLogo;
    navbar?: Array<TNavbarItem>;
    context?: TContext;
    handleToggleMenu?: () => void;
}

export default function Header({
                                   logo,
                                   navbar,
                                   context = 'neutral',
                                   handleToggleMenu
                               }: HeaderProps) {
    const handleLogoClick = (e: React.MouseEvent<HTMLDivElement>) => logo?.onClick && logo.onClick(e);
    const hasItems = (item: TNavbarItem) => !!item?.items?.length;
    return (
        <div className={`ui-header ui-header__context--${context}`} data-testid="ui-header">
            <div className="ui-header__brand">
                <Button
                    icon={{ icon: 'hamburger', noBorder: true }}
                    onClick={handleToggleMenu}
                    context={context}
                    className="ui-header__brand--button"
                    aria-label="Toggle menu"
                    appearance="icon"
                />
                {logo && (
                    <div
                        className="ui-header__brand--logo"
                        onClick={handleLogoClick}
                        tabIndex={0}
                        role="button"
                        aria-label="Go to home page">
                        <Image
                            src={logo.src}
                            alt={logo.alt}
                            title={logo.title}
                            width={logo.width}
                            height={logo.height}
                        />
                    </div>
                )}
            </div>
            <nav className="ui-header__nav" aria-label="main navigation">
                <ul role="menu" className="ui-header__nav--list">
                    {navbar?.map((item) => (
                        <li
                            key={item.key}
                            role={item.items?.length ? 'menuitem' : 'none'}
                            className={`ui-header__nav--list-item ${item.items?.length ? 'ui-header__nav--list-dropdown' : ''}`}>
                            {
                                hasItems(item) ? (
                                    <Dropdown label={item.label} type="link" context={context}>
                                        {item?.items?.map((subItem) => (
                                            <Link
                                                key={subItem.key}
                                                context={context}
                                                onClick={subItem?.onRedirect}
                                                className="ui-header__nav--list-link"
                                            >
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </Dropdown>
                                ) : (
                                    <Link
                                        context={context}
                                        onClick={item?.onRedirect}
                                        className="ui-header__nav--list-link">
                                        {item.label}
                                    </Link>
                                )
                            }
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};
