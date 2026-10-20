import { useTranslations } from 'next-intl';

import { fieldLanguage } from '@/shared/api';
import { Link, newsArticleRoute } from '@/shared/config';
import { Card } from '@/shared/ui/card';
import { ArrowRight } from '@/shared/ui/icon';
import { Tag } from '@/shared/ui/tag';

import type { NewsPreview } from '../model/news-preview.ts';
import { NewsDate } from './news-date.tsx';

type NewsCardProps = Readonly<{
  news: NewsPreview;
  headingLevel?: 'h2' | 'h3';
  className?: string;
}>;

export function NewsCard({ news, headingLevel: Heading = 'h3', className }: NewsCardProps) {
  const t = useTranslations('NewsCard');

  return (
    <Card asChild radius="md" className={`relative flex flex-col p-4 lg:p-6 ${className ?? ''}`}>
      <article lang={news.language.lang}>
        {news.category !== undefined && (
          <Tag lang={news.category.lang} className="mb-4 lg:mb-6">
            {news.category.title}
          </Tag>
        )}
        <Heading className="line-clamp-2 text-body-l-medium text-text-heading lg:text-h5 lg:leading-7 lg:font-normal">
          <Link
            href={newsArticleRoute(news.slug)}
            className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-brand-primary-text"
          >
            {news.title}
          </Link>
        </Heading>
        <p className="mt-2 text-body-s text-text-muted">
          <NewsDate value={news.publishedAt} />
          {' · '}
          {t('readingTime', { minutes: news.readingMinutes })}
        </p>
        {news.excerpt !== undefined && (
          <p lang={fieldLanguage(news.language, 'summary')} className="mt-1 line-clamp-2 text-body-s text-text-body">
            {news.excerpt}
          </p>
        )}
        <span
          aria-hidden="true"
          className="mt-auto flex items-center justify-between pt-4 text-body-s text-brand-primary lg:pt-6"
        >
          {t('readMore')}
          <ArrowRight className="-mr-2 size-4" />
        </span>
      </article>
    </Card>
  );
}
