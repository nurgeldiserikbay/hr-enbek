import { z } from 'zod';

import { matchesQuery } from '@/shared/lib/search';

import { type LegalDocumentGroup, legalDocumentGroupSchema } from '../model/legal-document.ts';
import { LEGAL_DOCUMENTS_MOCK } from './legal-documents.mock.ts';

export function getLegalDocuments(query?: string): Promise<LegalDocumentGroup[]> {
  const groups = z.array(legalDocumentGroupSchema).parse(LEGAL_DOCUMENTS_MOCK);
  return Promise.resolve(
    groups
      .map((group) => ({
        ...group,
        documents: group.documents.filter(({ title, description }) => matchesQuery(query, title, description)),
      }))
      .filter((group) => group.documents.length > 0),
  );
}
