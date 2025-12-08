'use client';
import React, { useEffect, useState } from 'react';

import { Button, Text } from '@repo/ds';

import { useLoading, useUser } from '@repo/ui';

import { useI18n } from '@repo/i18n';

import { useFinance } from '../../hooks';

import { DashboardInfo } from './components';

import './page.scss';

export default function DashboardPage() {
  const { user } = useUser();
  const { isLoading } = useLoading();
  const { financeInfo, initialize, fetch } = useFinance();
  const { t } = useI18n();

  const [isCreatingFinance, setIsCreatingFinance] = useState(false);

  useEffect(() => {
    fetch().then();
  }, []);

  const handleCreateFinance = async () => {
    setIsCreatingFinance(true);
    try {
      await initialize();
    } finally {
      setIsCreatingFinance(false);
    }
  };

  return isLoading ? null : (
    <div className="dashboard">
      {!financeInfo
        ? (
          <div className="dashboard__empty">
            <Text tag="h1" variant="large">{t('the_user')} <strong>{user.name}</strong> {t('not_found_finance')}.</Text>
            <Button context="success" onClick={handleCreateFinance} disabled={isCreatingFinance}>
              {isCreatingFinance ? t('creating') : t('create_finance')}
            </Button>
          </div>
        ) : (
          (<DashboardInfo {...financeInfo}/>)
        )}
    </div>
  );
}