import { z } from 'zod';

import { requestCms } from '@/shared/api';
import type { Locale } from '@/shared/config';

import type { NewsFeed } from '../model/news-feed.ts';
import type { NewsCategory, NewsPreview, NewsSitemapEntry } from '../model/news-preview.ts';
import { newsCategorySchema, newsFeedSchema, newsSitemapSchema } from './news-schemas.ts';

const NEWS_PAGE_SIZE = 9;

interface NewsFeedRequest {
  locale: Locale;
  query?: string | undefined;
  category?: string | undefined;
  page?: number | undefined;
}

const requestNewsFeed = async (locale: Locale, query: Record<string, string | number | undefined>) =>
  newsFeedSchema.parse(await requestCms({ path: '/api/v1/public/news', locale, sections: ['news'], query }));

export function getNews({ locale, query, category, page = 1 }: NewsFeedRequest): Promise<NewsFeed> {
  return requestNewsFeed(locale, { q: query, category, page: page - 1, size: NEWS_PAGE_SIZE });
}

export async function getLatestNews(locale: Locale, limit: number): Promise<readonly NewsPreview[]> {
  const { items } = await requestNewsFeed(locale, { page: 0, size: limit });
  return items;
}

export async function getNewsCategories(locale: Locale): Promise<NewsCategory[]> {
  return z
    .array(newsCategorySchema)
    .parse(await requestCms({ path: '/api/v1/public/news/categories', locale, sections: ['news'] }));
}

export async function getNewsSitemap(): Promise<NewsSitemapEntry[]> {
  return newsSitemapSchema.parse(await requestCms({ path: '/api/v1/public/news/sitemap', sections: ['news'] }));
}
