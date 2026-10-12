import '../styles/globals.css';

import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import type { Locale } from '@/shared/config';
import { MAIN_CONTENT_ID } from '@/shared/config';

type RootDocumentProps = Readonly<{
  locale: Locale;
  children: ReactNode;
}>;

export async function RootDocument({ locale, children }: RootDocumentProps) {
  const t = await getTranslations({ locale, namespace: 'Common' });

  return (
    <html lang={locale}>
      <body className="min-h-dvh antialiased">
        <a
          href={`#${MAIN_CONTENT_ID}`}
          className={`sr-only rounded-md bg-surface-card px-4 py-2 text-text-heading focus:not-sr-only focus:absolute focus:top-4 focus:left-4`}
        >
          {t('skipToContent')}
        </a>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
