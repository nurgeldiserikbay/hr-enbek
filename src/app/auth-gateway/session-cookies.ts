import type { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const AUTH_COOKIE_PATH = '/api/auth';
const PASSPORT_COOKIE_PATH = '/api/auth/passport';
const PASSPORT_FLOW_MAX_AGE_SECONDS = 600;
const PASSWORD_CHANGE_MAX_AGE_SECONDS = 8 * 60 * 60;

export const SESSION_COOKIES = {
  refresh: 'ehr_refresh',
  pending: 'ehr_pending',
  passwordChange: 'ehr_password_change',
  passportFlow: 'ehr_passport_flow',
} as const;

export const tokenPairSchema = z.object({
  accessToken: z.string(),
  accessExpiresAt: z.string(),
  refreshToken: z.string(),
  refreshExpiresAt: z.string(),
  passwordChangeRequired: z.boolean().catch(false),
});

export type TokenPair = z.infer<typeof tokenPairSchema>;

const secondsUntil = (isoDate: string) => Math.max(Math.floor((Date.parse(isoDate) - Date.now()) / 1000), 0);

const baseOptions = (path: string) =>
  ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path }) as const;

export function storeTokenPair(response: NextResponse, pair: TokenPair) {
  response.cookies.set(SESSION_COOKIES.refresh, pair.refreshToken, {
    ...baseOptions(AUTH_COOKIE_PATH),
    maxAge: secondsUntil(pair.refreshExpiresAt),
  });
  if (pair.passwordChangeRequired) {
    response.cookies.set(SESSION_COOKIES.passwordChange, '1', {
      ...baseOptions(AUTH_COOKIE_PATH),
      maxAge: PASSWORD_CHANGE_MAX_AGE_SECONDS,
    });
  }
}

export function storePendingToken(response: NextResponse, token: string, expiresAt: string) {
  response.cookies.set(SESSION_COOKIES.pending, token, {
    ...baseOptions(AUTH_COOKIE_PATH),
    maxAge: secondsUntil(expiresAt),
  });
}

export function startPassportFlow(response: NextResponse, locale: string) {
  response.cookies.set(SESSION_COOKIES.passportFlow, locale, {
    ...baseOptions(PASSPORT_COOKIE_PATH),
    sameSite: 'lax',
    maxAge: PASSPORT_FLOW_MAX_AGE_SECONDS,
  });
}

export function clearCookie(response: NextResponse, name: string) {
  const path = name === SESSION_COOKIES.passportFlow ? PASSPORT_COOKIE_PATH : AUTH_COOKIE_PATH;
  response.cookies.set(name, '', { ...baseOptions(path), maxAge: 0 });
}

export function clearSessionCookies(response: NextResponse) {
  clearCookie(response, SESSION_COOKIES.refresh);
  clearCookie(response, SESSION_COOKIES.pending);
  clearCookie(response, SESSION_COOKIES.passwordChange);
}

export const readCookie = (request: NextRequest, name: string): string | undefined => {
  const value = request.cookies.get(name)?.value;
  return value === undefined || value === '' ? undefined : value;
};
