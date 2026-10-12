import { matchesQuery } from '@/shared/lib/search';

import { type Agreements, agreementsSchema } from '../model/agreement.ts';
import { AGREEMENTS_MOCK } from './agreements.mock.ts';

export function getAgreements(query?: string): Promise<Agreements> {
  const agreements = agreementsSchema.parse(AGREEMENTS_MOCK);
  return Promise.resolve({
    ...agreements,
    regional: agreements.regional.filter(({ title }) => matchesQuery(query, title)),
  });
}
