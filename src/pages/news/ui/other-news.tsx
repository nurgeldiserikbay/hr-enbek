import { useTranslations } from 'next-intl';

import { NewsDate, type NewsPreview } from '@/entities/news';
import { Link, newsArticleRoute, ROUTES } from '@/shared/config';
import { Card } from '@/shared/ui/card';
import { ArrowRight } from '@/shared/ui/icon';
import { Tag } from '@/shared/ui/tag';

type OtherNewsProps = Readonly<{
  news: readonly NewsPreview[];
}>;

export function OtherNews({ news }: OtherNewsProps) {
  const t = useTranslations('NewsArticlePage');

  return (
    <Card asChild className="p-4 lg:p-6">
      <section aria-labelledby="other-news">
        <h2 id="other-news" className="border-b border-border-default pb-3.5 text-h4 text-text-heading">
          {t('otherNews')}
        </h2>
        <ul>
          {news.map((item) => (
            <li key={item.id} className="relative border-b border-border-default py-4 last:border-b-0">
              {item.category !== undefined && <Tag className="mb-2">{item.category.title}</Tag>}
              <h3 className="text-body-l text-text-heading">
                <Link
                  href={newsArticleRoute(item.id)}
                  className="after:absolute after:inset-0 hover:text-brand-primary-text focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-brand-primary-text"
                >
                  {item.title}
                </Link>
              </h3>
              <p className="mt-1.5 text-caption text-text-muted">
                <NewsDate value={item.publishedAt} />
              </p>
            </li>
          ))}
        </ul>
        <Link
          href={ROUTES.news}
          className="inline-flex items-center gap-2 text-body-m-semibold text-brand-primary-text hover:underline"
        >
          {t('allNews')}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </section>
    </Card>
  );
}
