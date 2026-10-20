import { getLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { getRegionOptions } from '@/entities/regions';
import { FeedbackDialogProvider } from '@/features/send-feedback';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';

type SiteLayoutProps = Readonly<{
  children: ReactNode;
}>;

export async function SiteLayout({ children }: SiteLayoutProps) {
  const regions = await getRegionOptions(await getLocale());

  return (
    <FeedbackDialogProvider regions={regions}>
      <SiteHeader />
      {children}
      <SiteFooter />
    </FeedbackDialogProvider>
  );
}
