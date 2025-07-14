import React from 'react';

import './Navbar.scss';

type NavbarProps = {
    title: string;
    userName?: string;
}

export default function Navbar({ title, userName }: NavbarProps) {

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
            </div>
        </nav>
    );
};
