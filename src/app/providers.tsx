'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import { SessionRefresher } from '@/components/SessionRefresher';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionRefresher />
      {children}
    </SessionProvider>
  );
}
