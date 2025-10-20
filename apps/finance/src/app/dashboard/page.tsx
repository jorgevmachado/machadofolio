'use client'
import React, { useEffect, useState } from 'react';

import { Button, Text } from '@repo/ds';

import { useLoading, useUser } from '@repo/ui';

import { useFinance } from '../../hooks';

import { DashboardInfo } from './components';

import './page.scss';

export default function DashboardPage() {
    const { user } = useUser()
    const { isLoading } = useLoading();
    const { financeInfo, initialize, fetch } = useFinance();

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
                        <Text tag="h1" variant="large">The user <strong>{user.name}</strong> does not have any registered finances.</Text>
                        <Button context="success" onClick={handleCreateFinance} disabled={isCreatingFinance}>
                            {isCreatingFinance ? 'Creating...' : 'Create Finances'}
                        </Button>
                    </div>
                ) : (
                    (<DashboardInfo {...financeInfo}/>)
                )}
        </div>
    )
}