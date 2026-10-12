import { type NewsArticle, newsArticleSchema } from '../model/news-article.ts';
import { NEWS_ARTICLES_MOCK } from './news.mock.ts';

export function getNewsArticle(id: string): Promise<NewsArticle | undefined> {
  const article = NEWS_ARTICLES_MOCK.find((item) => item.id === id);
  return Promise.resolve(article === undefined ? undefined : newsArticleSchema.parse(article));
}
