"use client"
import React from 'react';

import { AlertProvider, LoadingProvider } from '@repo/ui';

import PageLayout from './page-layout';

type PageProvidersProps = {
    children: React.ReactNode;
};

export default function PageProviders({ children }: PageProvidersProps) {
 return (
     <AlertProvider>
         <LoadingProvider>
             <PageLayout>
                 {children}
             </PageLayout>
         </LoadingProvider>
     </AlertProvider>
 )
}