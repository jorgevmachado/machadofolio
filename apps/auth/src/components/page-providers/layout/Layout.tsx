"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { type  UserEntity } from '@repo/business';

import { Page, useAlert, useLoading, UserProvider } from '@repo/ui';

import { privateRoutes } from '../../../routes';
import { authService, getAccessToken, removeAccessToken } from '../../../shared';

type LayoutProps = {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const router = useRouter();
    const { addAlert } = useAlert();
    const { show, hide } = useLoading();

    const [user, setUser] = useState<UserEntity | undefined>(undefined);

    const handleLinkClick = useCallback(
        (path: string) => {
            if (path === '/logout') {
                removeAccessToken();
                setUser(undefined);
                return router.push('/');
            }
            router.push(path);
        },
        [router],
    );

    const navbarAction = useCallback(() => {
        if (!user) {
            return {
                label: 'Sign-in',
                onClick: () => router.push('/sign-in')
            }
        }
        return;
    }, [user, router]);

    const token = useMemo(() => getAccessToken() || '', []);

    const fetchUser = useCallback(async () => {
        try {
            show();
            const fetchedUser = await authService.me();
            setUser(fetchedUser);
        } catch (error) {
            addAlert({ type: 'error', message: 'Your token has expired!' });
            removeAccessToken();
            setUser(undefined);
        } finally {
            hide();
        }
    }, [show, hide, addAlert]);

    useEffect(() => {
        if(token) {
            fetchUser();
        }
    }, [token]);


    return (
        <div suppressHydrationWarning>
            {user ? (
                <UserProvider user={user}>
                    <Page
                        menu={privateRoutes}
                        userName={user?.name}
                        navbarTitle="Auth"
                        onLinkClick={handleLinkClick}
                        isAuthenticated={Boolean(user)}
                    >{children}</Page>
                </UserProvider>
            ) : (
                <Page
                    navbarAction={navbarAction()}
                    navbarTitle="Auth"
                    onLinkClick={handleLinkClick}
                    isAuthenticated={true}
                >{children}</Page>
            )}
        </div>
    );
}