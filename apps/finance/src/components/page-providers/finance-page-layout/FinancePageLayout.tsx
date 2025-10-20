"use client"
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useI18n } from '@repo/i18n';

import { Page, useUser, LanguageOption } from '@repo/ui';

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
    const { lang, setLanguage, t } = useI18n();

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

    const handleOnChangeLang = (languageOption: LanguageOption) => {
        setLanguage(languageOption.code);
    }

    return (
        <Page
            menu={loadMenu()}
            userName={user?.name}
            navbarTitle={t('financeTitle')}
            onLinkClick={handleLinkClick}
            isAuthenticated={Boolean(user)}
            internationalization={{ lang, onChange: handleOnChangeLang }}
        >{children}</Page>
    )
}