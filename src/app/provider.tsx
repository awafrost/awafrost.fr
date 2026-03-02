'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
