'use client';
import React, { useEffect, useState } from 'react';

import { Button, Text } from '@repo/ds';

import { useLoading, useUser } from '@repo/ui';

import { useI18n } from '@repo/i18n';

import { useFinance } from '../../domains';
import { DashboardInfo } from '../../domains/dashboard';

import './page.scss';

export default function DashboardPage() {
  const { user } = useUser();
  const { isLoading } = useLoading();

  return isLoading ? null : (
    <div className="dashboard">
      <h1>GEEK</h1>
    </div>
  );
}