import { z } from 'zod';

import {
  cmsContentLanguageShape,
  cmsFileSchema,
  cmsOptionalTextSchema,
  cmsRichTextSchema,
  toContentLanguage,
} from '@/shared/api';
import { routing } from '@/shared/config';

import type { NewsArticle } from '../model/news-article.ts';
import type { NewsFeed } from '../model/news-feed.ts';
import type { NewsCategory, NewsPreview, NewsSitemapEntry } from '../model/news-preview.ts';

export const newsCategorySchema = z
  .object({ code: z.string().min(1), name: z.string(), langUsed: cmsContentLanguageShape.langUsed })
  .transform(({ code, name, langUsed }): NewsCategory => ({ id: code, title: name, lang: langUsed }));

const newsItemShape = {
  slug: z.string().min(1),
  title: z.string(),
  publishedAt: z.iso.datetime({ offset: true }),
  readingMinutes: z.number().int().nonnegative(),
  isPinned: z.boolean().catch(false),
  category: newsCategorySchema.nullish(),
  cover: cmsFileSchema.nullish(),
  coverAlt: cmsOptionalTextSchema,
  ...cmsContentLanguageShape,
};

type NewsItemFields = z.infer<z.ZodObject<typeof newsItemShape>>;

const toNewsPreviewFields = ({
  slug,
  title,
  publishedAt,
  readingMinutes,
  isPinned,
  category,
  cover,
  coverAlt,
  ...language
}: NewsItemFields): Omit<NewsPreview, 'excerpt'> => ({
  slug,
  title,
  publishedAt,
  readingMinutes,
  isPinned,
  category: category ?? undefined,
  cover: cover === null || cover === undefined ? undefined : { ...cover, alt: coverAlt ?? '' },
  language: toContentLanguage(language),
});

const newsPreviewSchema = z
  .object({ ...newsItemShape, summary: cmsOptionalTextSchema })
  .transform(({ summary, ...item }): NewsPreview => ({ ...toNewsPreviewFields(item), excerpt: summary }));

export const newsSitemapSchema = z.array(
  z
    .object({
      slug: z.string().min(1),
      updatedAt: z.iso.datetime({ offset: true }),
      languages: z.array(z.string()).transform((codes) => routing.locales.filter((locale) => codes.includes(locale))),
    })
    .transform(({ slug, updatedAt, languages }): NewsSitemapEntry => ({ slug, updatedAt, languages })),
);

export const newsFeedSchema = z
  .object({
    content: z.array(newsPreviewSchema),
    page: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  })
  .transform(({ content, page, totalPages }): NewsFeed => ({ items: content, page: page + 1, pageCount: totalPages }));

export const newsArticleSchema = z
  .object({
    ...newsItemShape,
    subtitle: cmsOptionalTextSchema,
    body: cmsRichTextSchema,
    seo: z.object({ title: cmsOptionalTextSchema, description: cmsOptionalTextSchema }).nullish(),
    languages: z.array(z.string()).transform((codes) => routing.locales.filter((locale) => codes.includes(locale))),
    related: z.array(newsPreviewSchema).nullish(),
  })
  .transform(({ subtitle, body, seo, languages, related, ...item }): NewsArticle => ({
    ...toNewsPreviewFields(item),
    lead: subtitle,
    body,
    seo: { title: seo?.title, description: seo?.description },
    languages,
    related: related ?? [],
  }));
