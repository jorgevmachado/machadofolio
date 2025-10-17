import React from 'react';

import { Button } from '@repo/ds';

import Internationalization from './internationalization';

import './Navbar.scss';

export type InternationalizationProps = React.ComponentProps<typeof Internationalization>;

type NavbarProps = {
    title: string;
    action?: {
        label: string;
        onClick: () => void;
    }
    userName?: string;
    internationalization?: InternationalizationProps;
}

export default function Navbar({ title, action, userName, internationalization }: NavbarProps) {
    return (
        <nav className="ui-navbar" data-testid="ui-navbar">
            <div className="ui-navbar__left">
                <span className="ui-navbar__left--logo">{title}</span>
            </div>
            <div className="ui-navbar__right">
                <div className="ui-navbar__right--profile"
                     style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    {userName
                        ? (
                            <>
                                <span className="navbar-welcome">
                                    Welcome, <strong>{userName}</strong>
                                </span>
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
