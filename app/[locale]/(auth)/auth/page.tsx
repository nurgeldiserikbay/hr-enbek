import type { Metadata } from 'next';
import { connection } from 'next/server';
import { getTranslations } from 'next-intl/server';

import { StaffLoginPage } from '@/pages/staff-login';
import { resolveLocale } from '@/shared/config';

export async function generateMetadata({ params }: Readonly<PageProps<'/[locale]/auth'>>): Promise<Metadata> {
  const t = await getTranslations({ locale: await resolveLocale(params), namespace: 'StaffLoginPage' });
  return { title: t('title'), robots: { index: false, follow: false } };
}

export default async function Page({ params }: Readonly<PageProps<'/[locale]/auth'>>) {
  await resolveLocale(params);
  await connection();
  return <StaffLoginPage />;
}
