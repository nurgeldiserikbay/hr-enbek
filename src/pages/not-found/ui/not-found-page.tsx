import { getTranslations } from 'next-intl/server';

import { MAIN_CONTENT_ID } from '@/shared/config';

export async function NotFoundPage() {
  const t = await getTranslations('NotFoundPage');

  return (
    <main id={MAIN_CONTENT_ID} className="mx-auto max-w-7xl px-4 py-24 text-center">
      <h1 className="text-h2 text-text-heading">{t('title')}</h1>
    </main>
  );
}
