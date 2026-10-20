import { connection } from 'next/server';

import { SiteLayout } from '@/app';

export default async function Layout({ children }: Readonly<LayoutProps<'/[locale]'>>) {
  await connection();
  return <SiteLayout>{children}</SiteLayout>;
}
