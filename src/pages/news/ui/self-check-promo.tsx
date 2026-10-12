import { useTranslations } from 'next-intl';

import { Link, ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { ArrowRight, ClipboardCheck } from '@/shared/ui/icon';
import { IconTile } from '@/shared/ui/icon-tile';

export function SelfCheckPromo() {
  const t = useTranslations('NewsArticlePage.selfCheck');

  return (
    <Card asChild tone="brand" className="p-4 lg:p-6">
      <section aria-labelledby="self-check-promo">
        <IconTile tone="inverse" size="sm">
          <ClipboardCheck />
        </IconTile>
        <h2 id="self-check-promo" className="mt-4 text-h4">
          {t('title')}
        </h2>
        <p className="mt-2 text-body-m text-brand-tint">{t('text')}</p>
        <Button asChild variant="inverse" className="mt-3 h-10 w-full text-body-l text-brand-primary-text">
          <Link href={ROUTES.selfCheck}>
            {t('action')}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </section>
    </Card>
  );
}
