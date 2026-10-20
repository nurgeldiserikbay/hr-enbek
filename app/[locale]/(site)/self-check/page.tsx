import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SelfCheckPage } from '@/pages/self-check';
import { localizedAlternates, resolveLocale, ROUTES } from '@/shared/config';

export async function generateMetadata({ params }: Readonly<PageProps<'/[locale]/self-check'>>): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'PageTitles' });
  return { title: t('selfCheck'), alternates: localizedAlternates(locale, ROUTES.selfCheck) };
}

export default async function Page({ params }: Readonly<PageProps<'/[locale]/self-check'>>) {
  await resolveLocale(params);
  return <SelfCheckPage />;
}
