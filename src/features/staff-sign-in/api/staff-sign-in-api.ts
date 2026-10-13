import { z } from 'zod';

import { AUTH_API, type SignatureChallenge, signatureChallengeSchema } from '@/entities/sessions';
import { readApiResponse } from '@/shared/api';

import { type Agreement, agreementSchema } from '../model/agreement.ts';

const challengeResponseSchema = z.object({ challenge: signatureChallengeSchema });

export interface StaffCredentials {
  login: string;
  password: string;
  agreement: Agreement;
}

const postJson = (url: string, body: unknown) =>
  fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export async function getAgreement(locale: string): Promise<Agreement> {
  const response = await fetch(`${AUTH_API.agreement}?lang=${encodeURIComponent(locale)}`);
  return agreementSchema.parse(await readApiResponse(response));
}

export async function submitCredentials({ login, password, agreement }: StaffCredentials): Promise<SignatureChallenge> {
  const response = await postJson(AUTH_API.staffLogin, {
    login,
    password,
    agreementAccepted: true,
    agreementId: agreement.id,
    agreementVersion: agreement.version,
  });
  return challengeResponseSchema.parse(await readApiResponse(response)).challenge;
}

export async function renewChallenge(): Promise<SignatureChallenge> {
  const response = await postJson(AUTH_API.staffChallenge, {});
  return challengeResponseSchema.parse(await readApiResponse(response)).challenge;
}

export async function verifySignature(cms: string): Promise<void> {
  await readApiResponse(await postJson(AUTH_API.staffVerify, { cms }));
}
