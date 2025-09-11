"use client"
import React from 'react';

import { AlertProvider, LoadingProvider } from '@repo/ui';

import Layout from './layout';

export default function PageProviders({ children }: React.PropsWithChildren) {
    return (
        <AlertProvider style={{ marginTop: '3.2rem'}}>
            <LoadingProvider>
                <Layout>
                    {children}
                </Layout>
            </LoadingProvider>
        </AlertProvider>)
}