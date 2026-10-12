import { redirect } from 'next/navigation';

import { resolveLocale } from '@/shared/config';

export default async function Page({ params }: Readonly<PageProps<'/[locale]/help'>>) {
  const locale = await resolveLocale(params);
  redirect(`/${locale}/help/faq`);
}
