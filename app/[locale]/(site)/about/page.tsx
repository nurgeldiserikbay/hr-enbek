import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { AboutPage } from '@/pages/about';
import { resolveLocale } from '@/shared/config';

export async function generateMetadata({ params }: Readonly<PageProps<'/[locale]/about'>>): Promise<Metadata> {
  const t = await getTranslations({ locale: await resolveLocale(params), namespace: 'PageTitles' });
  return { title: t('about') };
}

export default async function Page({ params }: Readonly<PageProps<'/[locale]/about'>>) {
  await resolveLocale(params);
  return <AboutPage />;
}
