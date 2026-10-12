import { z } from 'zod';

export const newsCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
});

export type NewsCategory = z.infer<typeof newsCategorySchema>;

export const newsPreviewSchema = z.object({
  id: z.string(),
  title: z.string(),
  excerpt: z.string(),
  publishedAt: z.iso.date(),
  readingMinutes: z.number().int().positive(),
  category: newsCategorySchema.optional(),
});

export type NewsPreview = z.infer<typeof newsPreviewSchema>;
