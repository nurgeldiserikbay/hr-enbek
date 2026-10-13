import type { ReactNode } from 'react';

import { getLabourInspections } from '@/entities/labour-inspections';
import { FeedbackDialogProvider } from '@/features/send-feedback';
import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';

type SiteLayoutProps = Readonly<{
  children: ReactNode;
}>;

export async function SiteLayout({ children }: SiteLayoutProps) {
  const inspections = await getLabourInspections();
  const regions = inspections.map(({ regionId: value, regionName: label }) => ({ value, label }));

  return (
    <FeedbackDialogProvider regions={regions}>
      <SiteHeader />
      {children}
      <SiteFooter />
    </FeedbackDialogProvider>
  );
}
