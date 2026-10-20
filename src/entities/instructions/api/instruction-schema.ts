import { z } from 'zod';

import {
  cmsAudienceSchema,
  cmsContentLanguageShape,
  cmsFileSchema,
  cmsOptionalTextSchema,
  toContentLanguage,
} from '@/shared/api';

import type { Instruction } from '../model/instruction.ts';

export const instructionSchema = z
  .object({
    id: z.uuid(),
    audience: cmsAudienceSchema,
    icon: cmsOptionalTextSchema,
    title: z.string(),
    description: cmsOptionalTextSchema,
    file: cmsFileSchema,
    url: cmsOptionalTextSchema,
    ...cmsContentLanguageShape,
  })
  .transform(({ id, audience, icon, title, description, file, url, ...language }): Instruction => ({
    id,
    title,
    description,
    audience,
    icon,
    pdfUrl: file.url,
    openUrl: url ?? file.url,
    language: toContentLanguage(language),
  }));
