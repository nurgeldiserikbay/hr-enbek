import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SelfCheckPage } from '@/pages/self-check';
import { resolveLocale } from '@/shared/config';

export async function generateMetadata({ params }: Readonly<PageProps<'/[locale]/self-check'>>): Promise<Metadata> {
  const t = await getTranslations({ locale: await resolveLocale(params), namespace: 'PageTitles' });
  return { title: t('selfCheck') };
}

export default async function Page({ params }: Readonly<PageProps<'/[locale]/self-check'>>) {
  await resolveLocale(params);
  return <SelfCheckPage />;
}
