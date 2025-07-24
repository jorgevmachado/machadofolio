import React from 'react';

import '@repo/tokens/dist/finance/css/_variables.css';
import '@repo/ds/dist/index.css';
import '@repo/ui/dist/index.css';

import { PageLayout } from '../components';

import './globals.css';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <PageLayout>
          {children}
      </PageLayout>
      </body>
    </html>
  );
}
