'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { Page, useAlert, useLoading, UserProvider } from '@repo/ui';

import { type UserEntity } from '@repo/business/index';

import { FinanceProvider } from '../../../domains';
import { publicRoutes } from '../../../routes';
import { authService, getAccessToken, removeAccessToken } from '../../../shared';

import FinancePageLayout from '../finance-page-layout';

type PageLayoutProps = {
    children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { addAlert } = useAlert();
  const { show, hide } = useLoading();

  const [user, setUser] = useState<UserEntity | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(getAccessToken());

  const isAuthenticationRoute = useMemo(
    () => publicRoutes.some((route) => route.path === pathname),
    [pathname],
  );

  const fetchUser = useCallback(async () => {
    try {
      show();
      const fetchedUser = await authService.me();
      setUser(fetchedUser);
    } catch (error) {
      addAlert({ type: 'error', message: 'Your token has expired!' });
      removeAccessToken();
      router.push('/');
      throw error;
    } finally {
      hide();
    }
  }, [router, addAlert, show, hide]);


  useEffect(() => {
    setToken(getAccessToken());
  }, []);

  useEffect(() => {
    if (token && !isAuthenticationRoute) {
      fetchUser().then();
    } else if (!token) {
      setUser(undefined);
    }
  }, [token]);

  if (isAuthenticationRoute && !user) {
    return (<Page isAuthenticated={false}>{children}</Page>);
  }

  return user ? (
    <UserProvider user={user}>
      <FinanceProvider>
        <FinancePageLayout>
          {children}
        </FinancePageLayout>
      </FinanceProvider>
    </UserProvider>
  ) : null;
}