import { ApiError, readApiResponse } from '@/shared/api';

import { AUTH_API } from '../config/auth-routes.ts';
import { type Session, sessionSchema } from '../model/session.ts';

const SESSION_LOCK_NAME = 'ehr-session';
const REFRESH_CONSUMED_STATUS = 409;

const postSession = async (isRetry = false): Promise<Session> => {
  const response = await fetch(AUTH_API.session, { method: 'POST', credentials: 'same-origin' });
  if (response.status === REFRESH_CONSUMED_STATUS && !isRetry) return postSession(true);
  return sessionSchema.parse(await readApiResponse(response));
};

export function fetchSession(): Promise<Session> {
  if (typeof navigator === 'undefined' || !('locks' in navigator)) return postSession();
  return navigator.locks.request(SESSION_LOCK_NAME, () => postSession());
}

export async function signOut(accessToken: string | undefined): Promise<void> {
  await fetch(AUTH_API.logout, {
    method: 'POST',
    credentials: 'same-origin',
    headers: accessToken === undefined ? {} : { Authorization: `Bearer ${accessToken}` },
  });
}

export const isSessionMissing = (error: unknown): boolean => error instanceof ApiError && error.status === 401;
