import { timingSafeEqual } from 'node:crypto';

import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { CMS_SECTIONS, cmsSectionTag, readCmsEnv } from '@/shared/api';

const BEARER_PREFIX = 'Bearer ';
const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;

const revalidateRequestSchema = z.object({ sections: z.array(z.enum(CMS_SECTIONS)).min(1) });

const isSameSecret = (received: string, expected: string) => {
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
};

const readBody = async (request: NextRequest): Promise<unknown> => {
  try {
    return (await request.json()) as unknown;
  } catch {
    return null;
  }
};

export async function postCmsRevalidate(request: NextRequest): Promise<Response> {
  const { CMS_REVALIDATE_TOKEN: expected } = readCmsEnv();
  if (expected === undefined) return new Response(null, { status: NOT_FOUND });

  const authorization = request.headers.get('authorization') ?? '';
  const received = authorization.startsWith(BEARER_PREFIX) ? authorization.slice(BEARER_PREFIX.length) : '';
  if (!isSameSecret(received, expected)) {
    return new Response(null, { status: UNAUTHORIZED });
  }

  const parsed = revalidateRequestSchema.safeParse(await readBody(request));
  if (!parsed.success) return new Response(null, { status: BAD_REQUEST });

  for (const section of new Set(parsed.data.sections)) revalidateTag(cmsSectionTag(section), { expire: 0 });
  return new Response(null, { status: NO_CONTENT });
}
