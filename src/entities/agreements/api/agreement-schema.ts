import { z } from 'zod';

import { cmsContentLanguageShape, cmsFileSchema, cmsOptionalTextSchema, toContentLanguage } from '@/shared/api';

import type { Agreement } from '../model/agreement.ts';

export const agreementSchema = z
  .object({
    id: z.uuid(),
    kind: z.enum(['GENERAL', 'SECTORAL', 'REGIONAL']),
    region: z.object({ code: z.string(), name: z.string(), langUsed: cmsContentLanguageShape.langUsed }).nullish(),
    title: z.string(),
    description: cmsOptionalTextSchema,
    files: z.object({ kk: cmsFileSchema.nullish(), ru: cmsFileSchema.nullish() }).nullish(),
    ...cmsContentLanguageShape,
  })
  .transform(({ id, kind, region, title, description, files, ...language }) => {
    const content = toContentLanguage(language);
    const agreement: Agreement = {
      id,
      title: region?.name ?? title,
      titleLang: region?.langUsed ?? content.lang,
      description,
      files: { kk: files?.kk?.url, ru: files?.ru?.url },
      language: content,
    };
    return { kind, agreement };
  });
