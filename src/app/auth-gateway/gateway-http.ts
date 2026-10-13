import { type NextRequest, NextResponse } from 'next/server';

import {
  type AuthServiceRequest,
  type AuthServiceResponse,
  type ClientContext,
  requestAuthService,
  SERVICE_UNAVAILABLE_CODE,
} from '@/shared/api';
import { env, LOCALE_COOKIE_NAME } from '@/shared/config';

const ORIGIN_REJECTED_CODE = 'auth.origin.invalid';

export const toServiceLanguage = (locale: string | null | undefined): 'kk' | 'ru' => (locale === 'ru' ? 'ru' : 'kk');

export const readClientContext = (request: NextRequest): ClientContext => ({
  userAgent: request.headers.get('user-agent'),
  forwardedFor: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip'),
  language: toServiceLanguage(request.cookies.get(LOCALE_COOKIE_NAME)?.value),
});

export async function callAuthService(
  request: NextRequest,
  serviceRequest: AuthServiceRequest,
): Promise<AuthServiceResponse> {
  try {
    return await requestAuthService(serviceRequest, readClientContext(request));
  } catch {
    return { status: 503, body: { status: 503, code: SERVICE_UNAVAILABLE_CODE, message: '' } };
  }
}

export const gatewayError = (status: number, code: string) =>
  NextResponse.json({ status, code, message: '' }, { status });

export const relay = ({ status, body }: AuthServiceResponse) =>
  body === null ? new NextResponse(null, { status }) : NextResponse.json(body, { status });

export const siteUrl = (path: string) => new URL(path, env.NEXT_PUBLIC_SITE_URL);

export const rejectForeignOrigin = (request: NextRequest): NextResponse | null =>
  request.headers.get('origin') === siteUrl('/').origin ? null : gatewayError(403, ORIGIN_REJECTED_CODE);

export const readBearerToken = (request: NextRequest): string | undefined => {
  const header = request.headers.get('authorization');
  return header?.startsWith('Bearer ') === true ? header.slice('Bearer '.length) : undefined;
};

export async function readJsonBody(request: NextRequest): Promise<unknown> {
  try {
    return (await request.json()) as unknown;
  } catch {
    return null;
  }
}
