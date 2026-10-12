import { z } from 'zod';

import { newsPreviewSchema } from './news-preview.ts';

export const newsFeedSchema = z.object({
  items: z.array(newsPreviewSchema),
  page: z.number().int().positive(),
  pageCount: z.number().int().nonnegative(),
});

export type NewsFeed = z.infer<typeof newsFeedSchema>;
