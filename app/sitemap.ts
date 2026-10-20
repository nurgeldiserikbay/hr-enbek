import type { MetadataRoute } from 'next';
import { connection } from 'next/server';

import { getNewsSitemap } from '@/entities/news';
import { HELP_SECTIONS, helpSectionRoute } from '@/pages/help';
import { env, type Locale, newsArticleRoute, ROUTES, routing } from '@/shared/config';

const STATIC_ROUTES = [
  ROUTES.home,
  ROUTES.about,
  ROUTES.employer,
  ROUTES.employee,
  ROUTES.news,
  ROUTES.selfCheck,
  ...HELP_SECTIONS.map((section) => helpSectionRoute(section)),
];

const absolute = (locale: Locale, pathname: string): string =>
  new URL(`/${locale}${pathname === '/' ? '' : pathname}`, env.NEXT_PUBLIC_SITE_URL).toString();

const localizedEntries = (
  pathname: string,
  languages: readonly Locale[],
  lastModified?: string,
): MetadataRoute.Sitemap => {
  const alternates = { languages: Object.fromEntries(languages.map((code) => [code, absolute(code, pathname)])) };
  return languages.map((locale) => ({
    url: absolute(locale, pathname),
    alternates,
    ...(lastModified === undefined ? {} : { lastModified }),
  }));
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const news = await getNewsSitemap();
  return [
    ...STATIC_ROUTES.flatMap((pathname) => localizedEntries(pathname, routing.locales)),
    ...news.flatMap(({ slug, updatedAt, languages }) => localizedEntries(newsArticleRoute(slug), languages, updatedAt)),
  ];
}
