import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { signatureChallengeSchema } from '@/entities/sessions';

import {
  callAuthService,
  gatewayError,
  readClientContext,
  readJsonBody,
  rejectForeignOrigin,
  relay,
  toServiceLanguage,
} from './gateway-http.ts';
import {
  clearCookie,
  readCookie,
  SESSION_COOKIES,
  storePendingToken,
  storeTokenPair,
  tokenPairSchema,
} from './session-cookies.ts';

const CHALLENGE_EXPIRED_CODE = 'auth.2fa.challenge.expired';
const INVALID_REQUEST_CODE = 'validation.failed';

const credentialsSchema = z.object({
  login: z.string(),
  password: z.string(),
  agreementAccepted: z.boolean(),
  agreementId: z.string(),
  agreementVersion: z.union([z.string(), z.number()]),
});

const pendingStepSchema = z.object({
  pendingToken: z.string(),
  pendingExpiresAt: z.string(),
  challenge: signatureChallengeSchema,
});

const signatureSchema = z.object({ cms: z.string().min(1) });

const respondWithChallenge = (body: unknown) => {
  const parsed = pendingStepSchema.safeParse(body);
  if (!parsed.success) return gatewayError(502, INVALID_REQUEST_CODE);
  const response = NextResponse.json({ challenge: parsed.data.challenge });
  storePendingToken(response, parsed.data.pendingToken, parsed.data.pendingExpiresAt);
  return response;
};

export async function getAgreement(request: NextRequest) {
  const language = toServiceLanguage(request.nextUrl.searchParams.get('lang'));
  return relay(await callAuthService(request, { path: `/api/v1/auth/agreement?lang=${language}` }));
}

export async function postStaffLogin(request: NextRequest) {
  const rejected = rejectForeignOrigin(request);
  if (rejected) return rejected;
  const credentials = credentialsSchema.safeParse(await readJsonBody(request));
  if (!credentials.success) return gatewayError(400, INVALID_REQUEST_CODE);

  const result = await callAuthService(request, {
    path: '/api/v1/auth/login',
    method: 'POST',
    body: { ...credentials.data, language: readClientContext(request).language },
  });
  return result.status === 200 ? respondWithChallenge(result.body) : relay(result);
}

export async function postStaffChallenge(request: NextRequest) {
  const rejected = rejectForeignOrigin(request);
  if (rejected) return rejected;
  const pendingToken = readCookie(request, SESSION_COOKIES.pending);
  if (pendingToken === undefined) return gatewayError(401, CHALLENGE_EXPIRED_CODE);

  const result = await callAuthService(request, {
    path: '/api/v1/auth/2fa/challenge',
    method: 'POST',
    body: { pendingToken },
  });
  return result.status === 200 ? respondWithChallenge(result.body) : relay(result);
}

export async function postStaffVerify(request: NextRequest) {
  const rejected = rejectForeignOrigin(request);
  if (rejected) return rejected;
  const pendingToken = readCookie(request, SESSION_COOKIES.pending);
  if (pendingToken === undefined) return gatewayError(401, CHALLENGE_EXPIRED_CODE);
  const signature = signatureSchema.safeParse(await readJsonBody(request));
  if (!signature.success) return gatewayError(400, INVALID_REQUEST_CODE);

  const result = await callAuthService(request, {
    path: '/api/v1/auth/2fa/verify',
    method: 'POST',
    body: { pendingToken, cms: signature.data.cms },
  });
  if (result.status !== 200) return relay(result);

  const pair = tokenPairSchema.safeParse(result.body);
  if (!pair.success) return gatewayError(502, INVALID_REQUEST_CODE);
  const response = new NextResponse(null, { status: 204 });
  storeTokenPair(response, pair.data);
  clearCookie(response, SESSION_COOKIES.pending);
  return response;
}
