import { z } from 'zod';

import { cmsAudienceSchema, cmsContentLanguageShape, cmsFileSchema, toContentLanguage } from '@/shared/api';

import type { Video } from '../model/video.ts';

export const videoSchema = z
  .object({
    id: z.uuid(),
    audience: cmsAudienceSchema,
    title: z.string(),
    videoUrl: z.url({ protocol: /^https?$/u }),
    preview: cmsFileSchema.nullish(),
    durationSeconds: z.number().int().positive().nullish(),
    ...cmsContentLanguageShape,
  })
  .transform(({ id, audience, title, videoUrl, preview, durationSeconds, ...language }): Video => ({
    id,
    title,
    audience,
    durationSeconds: durationSeconds ?? undefined,
    thumbnailUrl: preview?.thumbnailUrl ?? preview?.url,
    url: videoUrl,
    language: toContentLanguage(language),
  }));
