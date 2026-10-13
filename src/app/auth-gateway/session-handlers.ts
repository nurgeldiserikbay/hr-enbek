import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { sessionUserSchema } from '@/entities/sessions';

import {
  callAuthService,
  gatewayError,
  readBearerToken,
  readJsonBody,
  rejectForeignOrigin,
  relay,
} from './gateway-http.ts';
import {
  clearCookie,
  clearSessionCookies,
  readCookie,
  SESSION_COOKIES,
  storeTokenPair,
  tokenPairSchema,
} from './session-cookies.ts';

const SESSION_MISSING_CODE = 'auth.session.missing';
const REFRESH_CONSUMED_CODE = 'auth.refresh.consumed';
const UNEXPECTED_RESPONSE_CODE = 'auth.response.invalid';

const errorCodeSchema = z.object({ code: z.string() });

const isRefreshConsumed = (body: unknown) => errorCodeSchema.safeParse(body).data?.code === REFRESH_CONSUMED_CODE;

const endSession = (status: number, code: string) => {
  const response = gatewayError(status, code);
  clearSessionCookies(response);
  return response;
};

export async function postSession(request: NextRequest) {
  const rejected = rejectForeignOrigin(request);
  if (rejected) return rejected;
  const refreshToken = readCookie(request, SESSION_COOKIES.refresh);
  if (refreshToken === undefined) return endSession(401, SESSION_MISSING_CODE);

  const refreshed = await callAuthService(request, {
    path: '/api/v1/auth/refresh',
    method: 'POST',
    body: { refreshToken },
  });
  if (refreshed.status === 401 && isRefreshConsumed(refreshed.body)) return gatewayError(409, REFRESH_CONSUMED_CODE);
  if (refreshed.status === 503) return relay(refreshed);
  const pair = tokenPairSchema.safeParse(refreshed.body);
  if (refreshed.status !== 200 || !pair.success) return endSession(401, SESSION_MISSING_CODE);

  const me = await callAuthService(request, { path: '/api/v1/auth/me', accessToken: pair.data.accessToken });
  const user = sessionUserSchema.safeParse(me.body);
  if (me.status !== 200 || !user.success) return gatewayError(502, UNEXPECTED_RESPONSE_CODE);

  const response = NextResponse.json({
    accessToken: pair.data.accessToken,
    accessExpiresAt: pair.data.accessExpiresAt,
    passwordChangeRequired: readCookie(request, SESSION_COOKIES.passwordChange) !== undefined,
    user: user.data,
  });
  storeTokenPair(response, { ...pair.data, passwordChangeRequired: false });
  return response;
}

export async function postPasswordChange(request: NextRequest) {
  const rejected = rejectForeignOrigin(request);
  if (rejected) return rejected;
  const result = await callAuthService(request, {
    path: '/api/v1/auth/password/change',
    method: 'POST',
    body: await readJsonBody(request),
    accessToken: readBearerToken(request),
  });
  const response = relay(result);
  if (result.status === 204) clearCookie(response, SESSION_COOKIES.passwordChange);
  return response;
}

export async function postLogout(request: NextRequest) {
  const rejected = rejectForeignOrigin(request);
  if (rejected) return rejected;
  const accessToken = readBearerToken(request);
  if (accessToken !== undefined) {
    await callAuthService(request, { path: '/api/v1/auth/logout', method: 'POST', accessToken });
  }
  const response = new NextResponse(null, { status: 204 });
  clearSessionCookies(response);
  return response;
}
