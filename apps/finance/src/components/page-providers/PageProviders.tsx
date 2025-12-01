"use client"
import React from 'react';

import { I18nProvider } from '@repo/i18n';

import { AlertProvider, LoadingProvider } from '@repo/ui';

import PageLayout from './page-layout';

type PageProvidersProps = {
    children: React.ReactNode;
};

export default function PageProviders({ children }: PageProvidersProps) {
    return (
        <I18nProvider brand="finance" defaultLang="en">
            <AlertProvider style={{ marginTop: '3.2rem'}}>
                <LoadingProvider>
                    <PageLayout>
                        {children}
                    </PageLayout>
                </LoadingProvider>
            </AlertProvider>
        </I18nProvider>
    )
}