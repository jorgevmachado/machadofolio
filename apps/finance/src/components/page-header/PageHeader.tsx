'use client';

import React from 'react';

import { Button, Text } from '@repo/ds';

import { useI18n } from '@repo/i18n';

import './PageHeader.scss';

type PageHeaderProps = {
    action?: {
        label: string;
        onClick: () => void;
        disabled?: boolean;
    };
    resourceName: string;
}

export default function PageHeader({
  action,
  resourceName,
}: PageHeaderProps) {
  const { t } = useI18n();
  return (
    <div className="page-header">
      <Text id="page-header-title" tag="h1" variant="big">
        {t('management_of')} {resourceName}
      </Text>
      {action && (
        <Button id="page-header-action" onClick={action.onClick} context="success" disabled={action?.disabled}>
          {action.label}
        </Button>
      )}
    </div>
  );
}