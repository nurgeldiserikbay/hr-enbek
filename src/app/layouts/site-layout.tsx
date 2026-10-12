import type { ReactNode } from 'react';

import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';

type SiteLayoutProps = Readonly<{
  children: ReactNode;
}>;

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
