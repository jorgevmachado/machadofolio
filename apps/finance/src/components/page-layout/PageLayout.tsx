"use client"
import React, { useCallback, useMemo, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { type UserEntity } from '@repo/business';

import { Page } from '@repo/ui';

import { authService, getAccessToken, removeAccessToken } from '../../app/shared';

import { publicRoutes } from '../../routes';



type PageLayoutProps = {
    children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState<UserEntity | null>(null);

    const isAuthenticationRoute = useMemo(
        () => publicRoutes.some((route) => route.path === pathname),
        [pathname],
    );

    const token = useMemo(() => getAccessToken() || '', []);

    const fetchUser = useCallback(async () => {
        try {
            const fetchedUser = await authService.me();
            setUser(fetchedUser);
        } catch (error) {
            // addAlert({ type: 'error', message: 'Your token has expired!' });
            removeAccessToken();
            router.push('/');
        }
    }, [ router ]);

    if(isAuthenticationRoute || !user) {
        return (<Page isAuthenticated={false}>{children}</Page>)
    }



    return (
        <div>
            {children}
        </div>
    )
}