import type { CmsFile, ContentLanguage } from '@/shared/api';
import type { Locale } from '@/shared/config';

export interface NewsCategory {
  id: string;
  title: string;
  lang: ContentLanguage['lang'];
}

interface NewsCover extends CmsFile {
  alt: string;
}

export interface NewsPreview {
  slug: string;
  title: string;
  excerpt: string | undefined;
  publishedAt: string;
  readingMinutes: number;
  isPinned: boolean;
  category: NewsCategory | undefined;
  cover: NewsCover | undefined;
  language: ContentLanguage;
}

export interface NewsSitemapEntry {
  slug: string;
  updatedAt: string;
  languages: readonly Locale[];
}
