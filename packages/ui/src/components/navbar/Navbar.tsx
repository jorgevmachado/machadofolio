import React from 'react';

import './Navbar.scss';
import { Button } from '@repo/ds';

type NavbarProps = {
    title: string;
    action?: {
        label: string;
         onClick: () => void;
    }
    userName?: string;
}

export default function Navbar({ title, action, userName }: NavbarProps) {

    return (
        <nav className="ui-navbar" data-testid="ui-navbar">
            <div className="ui-navbar__left">
                <span className="ui-navbar__left--logo">{title}</span>
            </div>
            <div className="ui-navbar__right">
                <div className="ui-navbar__right--profile">
                    {userName
                        ? (
                            <span> Welcome, <strong>{userName}</strong> </span>
                        )
                            : ('Welcome')
                    }
                </div>
                { action && (
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
