'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

const STALE_TIME_MS = 60_000;

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { staleTime: STALE_TIME_MS, retry: 1, refetchOnWindowFocus: false },
    },
  });

export function QueryProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
