import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { AudiencePage } from '@/pages/audience';
import { resolveLocale } from '@/shared/config';

export async function generateMetadata({ params }: Readonly<PageProps<'/[locale]/employer'>>): Promise<Metadata> {
  const t = await getTranslations({ locale: await resolveLocale(params), namespace: 'PageTitles' });
  return { title: t('employer') };
}

export default async function Page({ params }: Readonly<PageProps<'/[locale]/employer'>>) {
  await resolveLocale(params);
  return <AudiencePage audience="employer" />;
}
