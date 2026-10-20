import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { AudiencePage } from '@/pages/audience';
import { localizedAlternates, resolveLocale, ROUTES } from '@/shared/config';

export async function generateMetadata({ params }: Readonly<PageProps<'/[locale]/employee'>>): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'PageTitles' });
  return { title: t('employee'), alternates: localizedAlternates(locale, ROUTES.employee) };
}

export default async function Page({ params }: Readonly<PageProps<'/[locale]/employee'>>) {
  await resolveLocale(params);
  return <AudiencePage audience="employee" />;
}
