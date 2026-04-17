'use client';
import React, { useEffect, useRef } from 'react';

import { removeAccessToken } from 'auth/src/shared';
import { usePathname, useRouter } from 'next/navigation';

import { type LanguageOption, Page, useLoading,useUser } from '@repo/ui';

import { useI18n } from '@repo/i18n';

import { useFinance } from '../../../domains';
import { privateRoutes } from '../../../routes';

type FinancePageLayoutProps = {
    children: React.ReactNode;
}

export default function FinancePageLayout({ children }: FinancePageLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { show, hide } = useLoading();

  const pendingPath = useRef<string | null>(null);

  const { user } = useUser();
  const { financeInfo } = useFinance();
  const { lang, setLanguage, t } = useI18n();

  const loadMenu = () => {
    if (user?.finance || financeInfo) {
      return privateRoutes;
    }
    return privateRoutes.filter((item) => item.key === 'dashboard' || item.key === 'profile');
  };

  const handleLinkClick = (path: string) => {
    if (path !== pathname) {
      const isPathLogout = path === '/logout';
      const currentPath =  isPathLogout ? '/' : path;
      if (isPathLogout) {
        removeAccessToken();
      }
      show({ type: 'bar', size: 2, context: 'secondary' });
      pendingPath.current = currentPath;
      router.push(currentPath);
    }
  };

  const handleOnChangeLang = (languageOption: LanguageOption) => {
    setLanguage(languageOption.code);
  };

  useEffect(() => {
    if (pendingPath.current && pathname === pendingPath.current) {
      hide();
      pendingPath.current = null;
    }
  }, [pathname]);

  return (
    <Page
      translator={t}
      menu={loadMenu()}
      userName={user?.name}
      navbarTitle="Finance"
      onLinkClick={handleLinkClick}
      isAuthenticated={Boolean(user)}
      internationalization={{ lang, onChange: handleOnChangeLang, languageOptionsCode: ['en', 'pt-BR'] }}
    >{children}</Page>
  );
}