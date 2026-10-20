import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { AudiencePage } from '@/pages/audience';
import { localizedAlternates, resolveLocale, ROUTES } from '@/shared/config';

export async function generateMetadata({ params }: Readonly<PageProps<'/[locale]/employer'>>): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'PageTitles' });
  return { title: t('employer'), alternates: localizedAlternates(locale, ROUTES.employer) };
}

export default async function Page({ params }: Readonly<PageProps<'/[locale]/employer'>>) {
  await resolveLocale(params);
  return <AudiencePage audience="employer" />;
}
