import { ApiError, requestCms } from '@/shared/api';
import type { Locale } from '@/shared/config';

import type { NewsArticle } from '../model/news-article.ts';
import { newsArticleSchema } from './news-schemas.ts';

const NOT_FOUND = 404;

export async function getNewsArticle(locale: Locale, slug: string): Promise<NewsArticle | undefined> {
  try {
    const body = await requestCms({
      path: `/api/v1/public/news/${encodeURIComponent(slug)}`,
      locale,
      sections: ['news'],
    });
    return newsArticleSchema.parse(body);
  } catch (error) {
    if (error instanceof ApiError && error.status === NOT_FOUND) return undefined;
    throw error;
  }
}
