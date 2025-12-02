import React from 'react';

import { Button, Text } from '@repo/ds';

import { type TranslatorFunction } from '@repo/i18n';

import { Internationalization, type InternationalizationProps } from './internationalization';

import './Navbar.scss';


type NavbarProps = {
    title: string;
    action?: {
        label: string;
        onClick: () => void;
    }
    userName?: string;
    translator?: TranslatorFunction;
    internationalization?: InternationalizationProps;
}

export default function Navbar({ title, action, userName, translator, internationalization }: NavbarProps) {
    return (
        <nav className="ui-navbar" data-testid="ui-navbar">
            <div className="ui-navbar__left">
                <Text name="title" translator={translator} className="ui-navbar__left--logo">
                    {title}
                </Text>
            </div>
            <div className="ui-navbar__right">
                <div className="ui-navbar__right--profile"
                     style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    {userName
                        ? (
                            <>
                                <Text className="navbar-welcome" translator={translator}>
                                    Welcome, <strong>{userName}</strong>
                                </Text>
                                {internationalization && (
                                    <Internationalization {...internationalization}/>
                                )}

                            </>
                        )
                        : ('Welcome')
                    }
                </div>
                {action && (
                    <Button
                        context="primary"
                        onClick={action.onClick}
                        data-testid="ui-navbar-action">
                        {action.label}
                    </Button>
                )}
            </div>
        </nav>
    );
};