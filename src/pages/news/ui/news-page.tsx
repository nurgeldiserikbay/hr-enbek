import { SearchX } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getLabourInspections } from '@/entities/labour-inspections';
import { getNews, getNewsCategories, NewsCard } from '@/entities/news';
import { Link, type Locale, MAIN_CONTENT_ID, ROUTES } from '@/shared/config';
import { Card } from '@/shared/ui/card';
import { Chip } from '@/shared/ui/chip';
import { Pagination } from '@/shared/ui/pagination';
import { SearchField } from '@/shared/ui/search-field';
import { LabourInspection } from '@/widgets/labour-inspection';

import { type NewsFeedFilters, newsFeedHref } from '../lib/news-feed-href.ts';

type NewsPageProps = Readonly<{
  locale: Locale;
  filters: NewsFeedFilters;
}>;

export async function NewsPage({ locale, filters }: NewsPageProps) {
  const t = await getTranslations('NewsPage');
  const [feed, categories, inspections] = await Promise.all([
    getNews({ locale, ...filters }),
    getNewsCategories(locale),
    getLabourInspections(locale),
  ]);
  const categoryOptions = [{ id: undefined, title: t('all'), lang: locale }, ...categories];

  return (
    <main id={MAIN_CONTENT_ID} className="page-container flex flex-col pt-6 pb-12 lg:pt-14 lg:pb-11">
      <Card className="p-4 lg:p-8">
        <h1 className="text-h2-xs text-text-heading lg:text-h1-sm">
          {t('titleStart')} <span className="text-brand-primary">{t('titleAccent')}</span>
        </h1>
        <p className="mt-2 text-body-l text-text-body lg:mt-5">{t('description')}</p>
        <SearchField
          className="mt-4 lg:mt-5"
          label={t('searchLabel')}
          placeholder={t('searchPlaceholder')}
          {...(filters.query === undefined ? {} : { defaultValue: filters.query })}
        />
      </Card>

      <nav
        aria-label={t('categories')}
        className="-mx-4 mt-6 overflow-x-auto px-4 lg:mx-0 lg:mt-8 lg:overflow-visible lg:px-0"
      >
        <ul className="flex gap-2 lg:flex-wrap">
          {categoryOptions.map(({ id, title, lang }) => (
            <li key={id ?? 'all'} className="shrink-0">
              <Chip asChild isActive={filters.category === id}>
                <Link
                  href={newsFeedHref(ROUTES.news, { ...filters, category: id, page: 1 })}
                  lang={lang}
                  scroll={false}
                >
                  {title}
                </Link>
              </Chip>
            </li>
          ))}
        </ul>
      </nav>

      {feed.items.length === 0 ? (
        <Card className="mt-8 flex flex-col items-center gap-3 p-10 text-center lg:mt-13">
          <SearchX aria-hidden="true" className="size-8 text-text-muted" />
          <p className="text-body-l-medium text-text-heading">{t('empty')}</p>
        </Card>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:mt-13 lg:grid-cols-3 lg:gap-6">
          {feed.items.map((news) => (
            <li key={news.slug} className="flex">
              <NewsCard news={news} headingLevel="h2" className="w-full" />
            </li>
          ))}
        </ul>
      )}

      <Pagination
        className="mt-8 justify-center lg:mt-13 lg:justify-end"
        currentPage={feed.page}
        pageCount={feed.pageCount}
        hrefForPage={(page) => newsFeedHref(ROUTES.news, { ...filters, page })}
        label={t('pagination.label')}
        previousLabel={t('pagination.previous')}
        nextLabel={t('pagination.next')}
        pageLabel={(page) => t('pagination.page', { page })}
      />

      <div className="mt-8 lg:mt-13">
        <LabourInspection inspections={inspections} />
      </div>
    </main>
  );
}
