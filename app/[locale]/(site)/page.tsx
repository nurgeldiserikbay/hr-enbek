import { HomePage } from '@/pages/home';
import { resolveLocale } from '@/shared/config';

export default async function Page({ params }: Readonly<PageProps<'/[locale]'>>) {
  await resolveLocale(params);
  return <HomePage />;
}
