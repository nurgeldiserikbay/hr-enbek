'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchSession } from '../api/session-api.ts';
import type { Session } from './session.ts';

export const SESSION_QUERY_KEY = ['session'] as const;

const REFRESH_AHEAD_MS = 60_000;
const MIN_REFRESH_INTERVAL_MS = 30_000;

const sessionRefreshDelay = (session: Session, now: number): number =>
  Math.max(Date.parse(session.accessExpiresAt) - now - REFRESH_AHEAD_MS, MIN_REFRESH_INTERVAL_MS);

export function useSession() {
  return useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchSession,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    refetchInterval: (query) => (query.state.data ? sessionRefreshDelay(query.state.data, Date.now()) : false),
    refetchIntervalInBackground: true,
  });
}
