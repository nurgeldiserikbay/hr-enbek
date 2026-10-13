import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import { QueryProvider, RootDocument } from '@/app';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CabinetLayout({ children }: Readonly<LayoutProps<'/cabinet'>>) {
  const locale = await getLocale();

  return (
    <RootDocument locale={locale}>
      <QueryProvider>{children}</QueryProvider>
    </RootDocument>
  );
}
