import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { RootDocument } from '@/app';
import { env, localizedAlternates, resolveLocale, routing } from '@/shared/config';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Readonly<LayoutProps<'/[locale]'>>): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: { default: t('title'), template: t('titleTemplate') },
    description: t('description'),
    alternates: localizedAlternates(locale, '/'),
  };
}

export default async function LocaleLayout({ children, params }: Readonly<LayoutProps<'/[locale]'>>) {
  const locale = await resolveLocale(params);
  return <RootDocument locale={locale}>{children}</RootDocument>;
}
