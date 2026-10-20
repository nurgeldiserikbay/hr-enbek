import { z } from 'zod';

import { requestCms } from '@/shared/api';
import type { Locale } from '@/shared/config';

import type { LegalDocumentGroup } from '../model/legal-document.ts';
import { legalDocumentGroupSchema } from './legal-document-schema.ts';

export async function getLegalDocuments(locale: Locale, query?: string): Promise<LegalDocumentGroup[]> {
  const groups = z
    .array(legalDocumentGroupSchema)
    .parse(
      await requestCms({ path: '/api/v1/public/legal-acts', locale, sections: ['legal-acts'], query: { q: query } }),
    );
  return groups.filter((group) => group.documents.length > 0);
}
