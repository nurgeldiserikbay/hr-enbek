import { z } from 'zod';

import { AUDIENCES } from '@/shared/config';

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  audience: z.enum(AUDIENCES),
  durationSeconds: z.number().int().positive(),
  thumbnailUrl: z.string(),
  url: z.string(),
});

export type Video = z.infer<typeof videoSchema>;
