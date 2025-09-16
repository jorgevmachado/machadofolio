import React from 'react';

import '@repo/tokens/dist/finance/css/_variables.css';
import '@repo/ds/dist/index.css';
import '@repo/ui/dist/index.css';

import { PageProviders } from '../components';

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
