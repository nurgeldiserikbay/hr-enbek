import type { Metadata } from 'next';

import { type Locale, routing } from './routing.ts';

const localizedPath = (locale: Locale, pathname: string) => `/${locale}${pathname === '/' ? '' : pathname}`;

export function localizedAlternates(
  locale: Locale,
  pathname: string,
  available: readonly Locale[] = routing.locales,
): NonNullable<Metadata['alternates']> {
  const fallback = available.includes(routing.defaultLocale) ? routing.defaultLocale : (available[0] ?? locale);
  return {
    canonical: localizedPath(available.includes(locale) ? locale : fallback, pathname),
    languages: {
      ...Object.fromEntries(available.map((code) => [code, localizedPath(code, pathname)])),
      'x-default': localizedPath(fallback, pathname),
    },
  };
}
