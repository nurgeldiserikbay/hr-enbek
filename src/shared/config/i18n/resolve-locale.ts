import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';

import { type Locale, routing } from './routing.ts';

export const resolveLocale = async (params: Promise<{ locale: string }>): Promise<Locale> => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return locale;
};
