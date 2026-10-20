import type { Locale } from '@/shared/config';
import type { RichTextDocument } from '@/shared/lib/rich-text';

import type { NewsPreview } from './news-preview.ts';

export interface NewsArticle extends Omit<NewsPreview, 'excerpt'> {
  lead: string | undefined;
  body: RichTextDocument;
  seo: { title: string | undefined; description: string | undefined };
  languages: readonly Locale[];
  related: readonly NewsPreview[];
}
