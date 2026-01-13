import React from 'react';

import { PageProviders } from '../components';

import '@repo/tokens/dist/auth/css/_variables.css';
import '@repo/ds/dist/index.css';
import '@repo/ui/dist/index.css';
import './page.scss';

export const metadata = {
  title: 'Machadofolio Auth',
  icons: [{ rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PageProviders>
          {children}
        </PageProviders>
      </body>
    </html>
  );
}
