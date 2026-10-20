import { z } from 'zod';

import { cmsContentLanguageShape, cmsFileSchema, cmsOptionalTextSchema, toContentLanguage } from '@/shared/api';

import type { LegalDocument, LegalDocumentGroup } from '../model/legal-document.ts';

const legalDocumentSchema = z
  .object({
    id: z.uuid(),
    title: z.string(),
    description: cmsOptionalTextSchema,
    url: cmsOptionalTextSchema,
    file: cmsFileSchema.nullish(),
    ...cmsContentLanguageShape,
  })
  .transform(({ id, title, description, url, file, ...language }): LegalDocument => ({
    id,
    title,
    description,
    openUrl: url,
    pdfUrl: file?.url,
    language: toContentLanguage(language),
  }));

export const legalDocumentGroupSchema = z
  .object({
    code: z.string().min(1),
    name: z.string(),
    langUsed: cmsContentLanguageShape.langUsed,
    icon: cmsOptionalTextSchema,
    items: z.array(legalDocumentSchema),
  })
  .transform(({ code, name, langUsed, icon, items }): LegalDocumentGroup => ({
    id: code,
    title: name,
    icon,
    lang: langUsed,
    documents: items,
  }));
