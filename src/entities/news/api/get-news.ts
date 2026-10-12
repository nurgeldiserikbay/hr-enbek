import { z } from 'zod';

import { matchesQuery } from '@/shared/lib/search';

import { type NewsFeed, newsFeedSchema } from '../model/news-feed.ts';
import { type NewsCategory, newsCategorySchema, type NewsPreview } from '../model/news-preview.ts';
import { NEWS_ARTICLES_MOCK, NEWS_CATEGORIES_MOCK } from './news.mock.ts';

const NEWS_PAGE_SIZE = 9;

interface NewsFeedRequest {
  query?: string | undefined;
  category?: string | undefined;
  page?: number | undefined;
}

export function getNews({ query, category, page = 1 }: NewsFeedRequest = {}): Promise<NewsFeed> {
  const matching = NEWS_ARTICLES_MOCK.filter(
    (article) =>
      (category === undefined || article.category.id === category) &&
      matchesQuery(query, article.title, article.excerpt),
  );

  return Promise.resolve(
    newsFeedSchema.parse({
      items: matching.slice((page - 1) * NEWS_PAGE_SIZE, page * NEWS_PAGE_SIZE),
      page,
      pageCount: Math.ceil(matching.length / NEWS_PAGE_SIZE),
    }),
  );
}

interface LatestNewsRequest {
  limit?: number;
  excludeId?: string;
}

export async function getLatestNews({ limit = 4, excludeId }: LatestNewsRequest = {}): Promise<NewsPreview[]> {
  const { items } = await getNews();
  return items.filter((item) => item.id !== excludeId).slice(0, limit);
}

export function getNewsCategories(): Promise<NewsCategory[]> {
  return Promise.resolve(z.array(newsCategorySchema).parse(NEWS_CATEGORIES_MOCK));
}
