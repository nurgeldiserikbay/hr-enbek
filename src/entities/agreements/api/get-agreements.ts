import { z } from 'zod';

import { requestCms } from '@/shared/api';
import type { Locale } from '@/shared/config';

import type { Agreements } from '../model/agreement.ts';
import { agreementSchema } from './agreement-schema.ts';

export async function getAgreements(locale: Locale, query?: string): Promise<Agreements> {
  const agreements = z.array(agreementSchema).parse(
    await requestCms({
      path: '/api/v1/public/agreements',
      locale,
      sections: ['agreements', 'regions'],
      query: { q: query },
    }),
  );
  return {
    general: agreements.filter(({ kind }) => kind === 'GENERAL').map(({ agreement }) => agreement),
    regional: agreements.filter(({ kind }) => kind === 'REGIONAL').map(({ agreement }) => agreement),
  };
}
