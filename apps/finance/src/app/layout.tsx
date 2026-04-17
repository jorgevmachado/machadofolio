import React from 'react';

import { PageProviders } from '../components';

import '@repo/tokens/dist/finance/css/_variables.css';
import '@repo/ds/dist/index.css';
import '@repo/ui/dist/index.css';
import './page.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <PageProviders>
          {children}
        </PageProviders>
      </body>
    </html>
  );
}
