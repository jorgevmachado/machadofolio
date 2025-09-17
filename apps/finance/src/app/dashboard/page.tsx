'use client'
import React, { useEffect } from 'react';

import { Button, Text } from '@repo/ds';

import { useLoading, useUser } from '@repo/ui';

import { useFinance } from '../../hooks';

import { DashboardInfo } from './components';

import './page.scss';

export default function DashboardPage() {
    const { user } = useUser()
    const { isLoading } = useLoading();
    const { financeInfo, initialize, fetch } = useFinance();

    useEffect(() => {
        fetch().then();
    }, []);

    return isLoading ? null : (
        <div className="dashboard">
            {!financeInfo
                ? (
                    <div className="dashboard__empty">
                        <Text tag="h1" variant="large">O Usuário <strong>{user.name}</strong> não possui finanças
                            cadastradas.</Text>
                        <Button context="success" onClick={initialize}>Criar Finanças</Button>
                    </div>
                ) : (
                    (<DashboardInfo {...financeInfo}/>)
                )}
        </div>
    )
}