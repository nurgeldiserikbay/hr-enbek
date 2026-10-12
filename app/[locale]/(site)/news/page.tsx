import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { NewsPage, parseNewsPage } from '@/pages/news';
import { resolveLocale } from '@/shared/config';
import { readSearchParam } from '@/shared/lib/search';

type NewsRouteProps = Readonly<PageProps<'/[locale]/news'>>;

export async function generateMetadata({ params }: NewsRouteProps): Promise<Metadata> {
  const t = await getTranslations({ locale: await resolveLocale(params), namespace: 'PageTitles' });
  return { title: t('news') };
}

export default async function Page({ params, searchParams }: NewsRouteProps) {
  await resolveLocale(params);
  const query = await searchParams;

  return (
    <NewsPage
      filters={{
        query: readSearchParam(query['q']),
        category: readSearchParam(query['category']),
        page: parseNewsPage(query['page']),
      }}
    />
  );
}
