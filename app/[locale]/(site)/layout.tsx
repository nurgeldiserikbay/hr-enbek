import { SiteLayout } from '@/app';

export default function Layout({ children }: Readonly<LayoutProps<'/[locale]'>>) {
  return <SiteLayout>{children}</SiteLayout>;
}
