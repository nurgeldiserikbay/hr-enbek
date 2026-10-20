import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { AboutPage } from '@/pages/about';
import { localizedAlternates, resolveLocale, ROUTES } from '@/shared/config';

export async function generateMetadata({ params }: Readonly<PageProps<'/[locale]/about'>>): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'PageTitles' });
  return { title: t('about'), alternates: localizedAlternates(locale, ROUTES.about) };
}

export default async function Page({ params }: Readonly<PageProps<'/[locale]/about'>>) {
  await resolveLocale(params);
  return <AboutPage />;
}
