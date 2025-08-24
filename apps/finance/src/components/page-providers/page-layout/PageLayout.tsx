"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { type UserEntity } from '@repo/business/index';

import { Page, useAlert, useLoading, UserProvider } from '@repo/ui';

import { authService, getAccessToken, removeAccessToken } from '../../../app/shared';

import { privateRoutes, publicRoutes } from '../../../routes';

type PageLayoutProps = {
    children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { addAlert } = useAlert();
    const { show, hide } = useLoading();

    const [user, setUser] = useState<UserEntity | undefined>(undefined);

    const isAuthenticationRoute = useMemo(
        () => publicRoutes.some((route) => route.path === pathname),
        [pathname],
    );

    const token = useMemo(() => getAccessToken() || '', []);

    const fetchUser = useCallback(async () => {
        try {
            show()
            const fetchedUser = await authService.me();
            setUser(fetchedUser);
        } catch (error) {
            addAlert({ type: 'error', message: 'Your token has expired!' });
            removeAccessToken();
            router.push('/');
        } finally {
            hide()
        }
    }, [router, addAlert, show, hide]);

    const handleLinkClick = useCallback(
        (path: string) => {
            router.push(path);
        },
        [router],
    );

    useEffect(() => {
        if(token && !isAuthenticationRoute) {
            fetchUser().then();
        }
    }, [token]);

    if(isAuthenticationRoute && !user) {
        return (<Page isAuthenticated={false}>{children}</Page>)
    }

    return user ? (
        <UserProvider user={user}>
            <Page
                menu={privateRoutes}
                userName={user?.name}
                navbarTitle="Finance"
                onLinkClick={handleLinkClick}
                isAuthenticated={Boolean(user)}
            >{children}</Page>
        </UserProvider>
    ): null;
}