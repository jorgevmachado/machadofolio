import React from 'react';

import '@repo/tokens/dist/auth/css/_variables.css';
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
    <html lang="en">
      <head>
        <title>{typeof window !== 'undefined' ? (window.document.title || 'Machadofolio Auth') : 'Machadofolio Auth'}</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <PageProviders>
          {children}
        </PageProviders>
      </body>
    </html>
  );
}
