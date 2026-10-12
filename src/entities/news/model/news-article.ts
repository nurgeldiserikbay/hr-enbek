import { z } from 'zod';

import { sanitizeRichText } from '@/shared/lib/rich-text';

import { newsPreviewSchema } from './news-preview.ts';

export const newsArticleSchema = newsPreviewSchema.extend({
  body: z.string().transform(sanitizeRichText),
});

export type NewsArticle = z.infer<typeof newsArticleSchema>;
