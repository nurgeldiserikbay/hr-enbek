import type { NewsPreview } from './news-preview.ts';

export interface NewsFeed {
  items: readonly NewsPreview[];
  page: number;
  pageCount: number;
}
