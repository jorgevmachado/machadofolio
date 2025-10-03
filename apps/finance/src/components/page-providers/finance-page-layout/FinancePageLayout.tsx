"use client"
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { Page, useUser } from '@repo/ui';

import { privateRoutes } from '../../../routes';

import { useFinance } from '../../../hooks';
import { removeAccessToken } from 'auth/src/shared';

type FinancePageLayoutProps = {
    children: React.ReactNode;
}

export default function FinancePageLayout({ children }: FinancePageLayoutProps) {
    const router = useRouter();
    const { user } = useUser();
    const { financeInfo } = useFinance();

    const loadMenu = () => {
        if (user?.finance || financeInfo) {
            return privateRoutes;
        }
        return privateRoutes.filter((item) => item.key === 'dashboard' || item.key === 'profile');
    }

    const handleLinkClick = useCallback(
        (path: string) => {
            if (path === '/logout') {
                removeAccessToken();
                return router.push('/');
            }
            router.push(path);
        },
        [router],
    );

    return (
        <Page
            menu={loadMenu()}
            userName={user?.name}
            navbarTitle="Finance"
            onLinkClick={handleLinkClick}
            isAuthenticated={Boolean(user)}
        >{children}</Page>
    )
}