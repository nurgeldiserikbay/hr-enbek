import { NextRequest } from 'next/server';

import {
  getPassportCallback,
  getPassportStart,
  postLogout,
  postSession,
  postStaffLogin,
  postStaffVerify,
} from './index.ts';

vi.mock('@/shared/config', () => ({
  env: { NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' },
  LOCALE_COOKIE_NAME: 'NEXT_LOCALE',
  ROUTES: { login: '/login' },
  routing: { locales: ['kk', 'ru', 'en'], defaultLocale: 'kk' },
}));

const SITE = 'http://localhost:3000';
const AUTH_SERVICE = 'https://auth.test';
const PASSPORT = 'https://testpass.enbek.kz';

const PAIR = {
  accessToken: 'ehr_at_1',
  accessExpiresAt: '2030-01-01T00:15:00Z',
  refreshToken: 'ehr_rt_2',
  refreshExpiresAt: '2030-01-01T08:00:00Z',
  sessionId: 's-1',
  tokenType: 'Bearer',
};

const ME = {
  userId: 'u-1',
  sessionId: 's-1',
  authType: 'GOV_2FA',
  authLevel: 'PASSWORD_ECP',
  login: 'inspector1',
  displayName: 'Инспектор',
  iinMasked: '900***123',
  iinVerified: true,
  roles: [{ code: 'GOV_EMPLOYEE', govOrgId: 'g-1' }],
  permissions: ['CONTRACTS:READ'],
  orgPermissions: {},
  regionPermissions: {},
  employerBins: [],
};

const CHALLENGE = {
  challengeId: 'ch-1',
  dataToSign: 'text',
  dataToSignBase64: 'dGV4dA==',
  expiresAt: '2030-01-01T00:03:00Z',
};

const json = (status: number, body: unknown) => Response.json(body, { status });

const urlOf = (input: RequestInfo | URL) => (input instanceof Request ? input.url : input.toString());

const bodyOf = (init: RequestInit | undefined): unknown =>
  typeof init?.body === 'string' ? (JSON.parse(init.body) as unknown) : undefined;

const fetchMock = vi.fn<typeof fetch>();

const request = (path: string, init: { method?: string; cookie?: string; body?: unknown; origin?: string } = {}) =>
  new NextRequest(new URL(path, SITE), {
    method: init.method ?? 'POST',
    headers: {
      origin: init.origin ?? SITE,
      'user-agent': 'Browser/1.0',
      ...(init.cookie === undefined ? {} : { cookie: init.cookie }),
    },
    ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
  });

const serviceCall = (path: string) => fetchMock.mock.calls.find(([input]) => urlOf(input) === `${AUTH_SERVICE}${path}`);

beforeEach(() => {
  vi.stubEnv('AUTH_SERVICE_URL', AUTH_SERVICE);
  vi.stubEnv('PASSPORT_URL', PASSPORT);
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('staff sign-in gateway', () => {
  it('FR-AUTH-30: keeps the pending token in an HttpOnly cookie and returns only the challenge', async () => {
    fetchMock.mockResolvedValue(
      json(200, {
        step: 'ECP_REQUIRED',
        pendingToken: 'ehr_pf_1',
        pendingExpiresAt: '2030-01-01T00:05:00Z',
        challenge: CHALLENGE,
      }),
    );

    const response = await postStaffLogin(
      request('/api/auth/staff/login', {
        body: { login: 'inspector1', password: 'p', agreementAccepted: true, agreementId: 'a', agreementVersion: '1' },
      }),
    );

    expect(await response.json()).toEqual({ challenge: CHALLENGE });
    expect(response.cookies.get('ehr_pending')).toMatchObject({ value: 'ehr_pf_1', httpOnly: true, path: '/api/auth' });
    const headers = new Headers(serviceCall('/api/v1/auth/login')?.[1]?.headers);
    expect(headers.get('user-agent')).toBe('Browser/1.0');
    expect(headers.get('x-client-id')).toBe('hr-enbek-web');
  });

  it('FR-AUTH-43: stores the refresh token after the signature and drops the pending token', async () => {
    fetchMock.mockResolvedValue(json(200, { ...PAIR, passwordChangeRequired: true }));

    const response = await postStaffVerify(
      request('/api/auth/staff/verify', { cookie: 'ehr_pending=ehr_pf_1', body: { cms: 'MIIB' } }),
    );

    expect(response.status).toBe(204);
    expect(bodyOf(serviceCall('/api/v1/auth/2fa/verify')?.[1])).toEqual({
      pendingToken: 'ehr_pf_1',
      cms: 'MIIB',
    });
    expect(response.cookies.get('ehr_refresh')).toMatchObject({
      value: 'ehr_rt_2',
      httpOnly: true,
      sameSite: 'strict',
    });
    expect(response.cookies.get('ehr_password_change')?.value).toBe('1');
    expect(response.cookies.get('ehr_pending')?.value).toBe('');
  });

  it('rejects requests from another origin', async () => {
    const response = await postStaffLogin(request('/api/auth/staff/login', { origin: 'https://evil.test', body: {} }));

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('session gateway', () => {
  it('rotates the refresh token and returns the access token with the current user', async () => {
    fetchMock.mockResolvedValueOnce(json(200, PAIR)).mockResolvedValueOnce(json(200, ME));

    const response = await postSession(request('/api/auth/session', { cookie: 'ehr_refresh=ehr_rt_1' }));

    expect(await response.json()).toMatchObject({
      accessToken: 'ehr_at_1',
      passwordChangeRequired: false,
      user: { userId: 'u-1', authType: 'GOV_2FA' },
    });
    expect(response.cookies.get('ehr_refresh')?.value).toBe('ehr_rt_2');
    expect(new Headers(serviceCall('/api/v1/auth/me')?.[1]?.headers).get('authorization')).toBe('Bearer ehr_at_1');
  });

  it('asks the client to retry when another tab has just rotated the pair', async () => {
    fetchMock.mockResolvedValue(json(401, { status: 401, code: 'auth.refresh.consumed', message: '' }));

    const response = await postSession(request('/api/auth/session', { cookie: 'ehr_refresh=ehr_rt_1' }));

    expect(response.status).toBe(409);
    expect(response.cookies.get('ehr_refresh')).toBeUndefined();
  });

  it('ends the session when the refresh token is reused', async () => {
    fetchMock.mockResolvedValue(json(401, { status: 401, code: 'auth.refresh.reused', message: '' }));

    const response = await postSession(request('/api/auth/session', { cookie: 'ehr_refresh=ehr_rt_1' }));

    expect(response.status).toBe(401);
    expect(response.cookies.get('ehr_refresh')?.value).toBe('');
  });

  it('FR-AUTH-51: logs out on the service and clears the cookies', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const logout = request('/api/auth/logout', { cookie: 'ehr_refresh=ehr_rt_1' });
    logout.headers.set('authorization', 'Bearer ehr_at_1');

    const response = await postLogout(logout);

    expect(response.status).toBe(204);
    expect(serviceCall('/api/v1/auth/logout')).toBeDefined();
    expect(response.cookies.get('ehr_refresh')?.value).toBe('');
  });
});

describe('passport gateway', () => {
  it('FR-AUTH-01: redirects to Passport Enbek with the callback address and marks the flow', () => {
    const response = getPassportStart(request('/api/auth/passport/start?locale=ru', { method: 'GET' }));
    const location = new URL(response.headers.get('location') ?? '');

    expect(`${location.origin}${location.pathname}`).toBe(`${PASSPORT}/ru/user/login`);
    expect(location.searchParams.get('redirect_uri')).toBe(`${SITE}/api/auth/passport/callback`);
    expect(location.searchParams.get('redirect')).toBe('strict');
    expect(response.cookies.get('ehr_passport_flow')).toMatchObject({ value: 'ru', httpOnly: true });
  });

  it('FR-AUTH-02: exchanges the Passport token and forwards only the Passport cookies', async () => {
    fetchMock
      .mockResolvedValueOnce(json(200, { uid: 1, bearer_token: 'passport-token' }))
      .mockResolvedValueOnce(json(200, PAIR));

    const response = await getPassportCallback(
      request('/api/auth/passport/callback', {
        method: 'GET',
        cookie: 'ehr_passport_flow=ru; laravel_session=ls; ehr_refresh=old; passport_session=ps',
      }),
    );

    expect(response.headers.get('location')).toBe(`${SITE}/cabinet`);
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get('cookie')).toBe(
      'passport_session=ps; laravel_session=ls',
    );
    expect(bodyOf(serviceCall('/api/v1/auth/passport/exchange')?.[1])).toEqual({
      passportToken: 'passport-token',
    });
    expect(response.cookies.get('ehr_refresh')?.value).toBe('ehr_rt_2');
  });

  it('returns to the sign-in page when the flow was not started here', async () => {
    const response = await getPassportCallback(request('/api/auth/passport/callback', { method: 'GET' }));

    expect(response.headers.get('location')).toBe(`${SITE}/kk/login?error=auth.sso.state.invalid`);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows the service error code when the exchange is refused', async () => {
    fetchMock
      .mockResolvedValueOnce(json(200, { bearer_token: 'passport-token' }))
      .mockResolvedValueOnce(json(403, { status: 403, code: 'auth.passport.user.inactive', message: '' }));

    const response = await getPassportCallback(
      request('/api/auth/passport/callback', { method: 'GET', cookie: 'ehr_passport_flow=kk; passport_session=ps' }),
    );

    expect(response.headers.get('location')).toBe(`${SITE}/kk/login?error=auth.passport.user.inactive`);
  });
});
