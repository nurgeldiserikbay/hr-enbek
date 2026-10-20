import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { newsFeedHref, NewsPage, parseNewsPage } from '@/pages/news';
import { localizedAlternates, resolveLocale, ROUTES } from '@/shared/config';
import { readSearchParam } from '@/shared/lib/search';

type NewsRouteProps = Readonly<PageProps<'/[locale]/news'>>;

const readFilters = async (searchParams: NewsRouteProps['searchParams']) => {
  const query = await searchParams;
  return {
    query: readSearchParam(query['q']),
    category: readSearchParam(query['category']),
    page: parseNewsPage(query['page']),
  };
};

export async function generateMetadata({ params, searchParams }: NewsRouteProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'PageTitles' });
  const filters = await readFilters(searchParams);
  return {
    title: t('news'),
    alternates: localizedAlternates(locale, newsFeedHref(ROUTES.news, { ...filters, query: undefined })),
    ...(filters.query === undefined ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function Page({ params, searchParams }: NewsRouteProps) {
  const locale = await resolveLocale(params);
  return <NewsPage locale={locale} filters={await readFilters(searchParams)} />;
}
