import { type NextRequest, NextResponse } from 'next/server';
import { hasLocale } from 'next-intl';
import { z } from 'zod';

import { AUTH_API, SIGNED_IN_HOME } from '@/entities/sessions';
import { readPassportUrl } from '@/shared/api';
import { ROUTES, routing } from '@/shared/config';

import { callAuthService, siteUrl } from './gateway-http.ts';
import {
  clearCookie,
  readCookie,
  SESSION_COOKIES,
  startPassportFlow,
  storeTokenPair,
  tokenPairSchema,
} from './session-cookies.ts';

const PASSPORT_SESSION_COOKIES = ['passport_session', 'laravel_session'] as const;

const PASSPORT_ERRORS = {
  flowMissing: 'auth.sso.state.invalid',
  tokenMissing: 'auth.passport.token.invalid',
  unavailable: 'auth.passport.unavailable',
  exchangeFailed: 'auth.passport.exchange.failed',
} as const;

const passportUserSchema = z.object({ bearer_token: z.string().min(1) });
const errorCodeSchema = z.object({ code: z.string() });

const resolveFlowLocale = (value: string | null | undefined) =>
  hasLocale(routing.locales, value) ? value : routing.defaultLocale;

const redirectWithError = (locale: string, code: string) => {
  const target = siteUrl(`/${locale}${ROUTES.login}`);
  target.searchParams.set('error', code);
  const response = NextResponse.redirect(target, 303);
  clearCookie(response, SESSION_COOKIES.passportFlow);
  return response;
};

const passportCookieHeader = (request: NextRequest) =>
  PASSPORT_SESSION_COOKIES.flatMap((name) => {
    const value = readCookie(request, name);
    return value === undefined ? [] : [`${name}=${value}`];
  }).join('; ');

const fetchPassportToken = async (cookieHeader: string): Promise<string | null> => {
  const response = await fetch(new URL('/api/hr/user', readPassportUrl()), {
    headers: { Accept: 'application/json', Cookie: cookieHeader },
    cache: 'no-store',
  });
  if (!response.ok) return null;
  return passportUserSchema.safeParse(await response.json()).data?.bearer_token ?? null;
};

export function getPassportStart(request: NextRequest) {
  const locale = resolveFlowLocale(request.nextUrl.searchParams.get('locale'));
  const loginUrl = new URL(`/${locale}/user/login`, readPassportUrl());
  loginUrl.searchParams.set('redirect_uri', siteUrl(AUTH_API.passportCallback).href);
  loginUrl.searchParams.set('redirect', 'strict');
  const response = NextResponse.redirect(loginUrl, 303);
  startPassportFlow(response, locale);
  return response;
}

export async function getPassportCallback(request: NextRequest) {
  const flowLocale = readCookie(request, SESSION_COOKIES.passportFlow);
  const locale = resolveFlowLocale(flowLocale);
  if (flowLocale === undefined) return redirectWithError(locale, PASSPORT_ERRORS.flowMissing);

  const cookieHeader = passportCookieHeader(request);
  if (cookieHeader === '') return redirectWithError(locale, PASSPORT_ERRORS.tokenMissing);

  let passportToken: string | null;
  try {
    passportToken = await fetchPassportToken(cookieHeader);
  } catch {
    return redirectWithError(locale, PASSPORT_ERRORS.unavailable);
  }
  if (passportToken === null) return redirectWithError(locale, PASSPORT_ERRORS.tokenMissing);

  const exchanged = await callAuthService(request, {
    path: '/api/v1/auth/passport/exchange',
    method: 'POST',
    body: { passportToken },
  });
  const pair = tokenPairSchema.safeParse(exchanged.body);
  if (exchanged.status !== 200 || !pair.success) {
    return redirectWithError(
      locale,
      errorCodeSchema.safeParse(exchanged.body).data?.code ?? PASSPORT_ERRORS.exchangeFailed,
    );
  }

  const response = NextResponse.redirect(siteUrl(SIGNED_IN_HOME), 303);
  storeTokenPair(response, pair.data);
  clearCookie(response, SESSION_COOKIES.passportFlow);
  return response;
}
