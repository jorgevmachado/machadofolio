import React, { useEffect, useState } from 'react';

import { useBreakpoint } from '@repo/ds';

import { Content, type InternationalizationProps, Navbar, Sidebar } from '../../components';
import type { TRoute } from '../../utils';

import './Page.scss';

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
    menu?: Array<TRoute>;
    title?: string;
    logout?: Partial<TRoute>;
    userName?: string;
    children: React.ReactNode;
    ariaLabel?: string;
    navbarTitle?: string;
    navbarAction?: {
        label: string;
        onClick: () => void;
    };
    sidebarOpen?: boolean;
    onLinkClick?: (path: string) => void;
    withAnimation?: boolean;
    isAuthenticated?: boolean;
    internationalization?: InternationalizationProps;
}

export default function Page({
    menu,
    title,
    logout,
    userName,
    children,
    ariaLabel,
    navbarTitle,
    navbarAction,
    sidebarOpen = true,
    onLinkClick,
    withAnimation = true,
    isAuthenticated = false,
    internationalization
}: PageProps) {
    const { isMobile } = useBreakpoint();

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [currentTitle, setCurrentTitle] = useState<string | undefined>(undefined);

    const handleSidebarToggle = (isOpen: boolean) => {
        setIsSidebarOpen(isOpen);
    };

    const treatLogout = (): TRoute => {
        return {
            key: 'logout',
            type: 'private',
            title: logout?.title ?? 'Logout',
            icon: logout?.icon ?? 'sign-out',
            path: logout?.path ?? '/logout'
        }
    }

    useEffect(() => {
        if(!isAuthenticated) {
            return;
        }
        setCurrentTitle(title);
        setIsSidebarOpen(!isMobile ? sidebarOpen : false);
    }, [isMobile, isAuthenticated, sidebarOpen, title]);

    return (
        <div className="ui-page" data-testid="ui-page">
            { isAuthenticated && (
                <>
                    <Navbar
                        title={navbarTitle || 'My App'}
                        action={navbarAction}
                        userName={userName}
                        internationalization={internationalization}
                    />
                    { menu && (
                        <Sidebar
                            menu={menu}
                            logout={treatLogout()}
                            onToggle={handleSidebarToggle}
                            isSidebarOpen={isSidebarOpen}
                            onLinkClick={onLinkClick}
                        />
                    )}
                </>
            )}
            <Content
                title={currentTitle}
                className={isAuthenticated ? '' : 'ui-page__content'}
                aria-label={ariaLabel}
                isSidebarOpen={isSidebarOpen}
                withAnimation={withAnimation}
            >
                {children}
            </Content>
        </div>
    );
};
