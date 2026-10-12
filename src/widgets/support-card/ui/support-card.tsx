import { useTranslations } from 'next-intl';

import { EXTERNAL_LINKS, Link, ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Phone } from '@/shared/ui/icon';
import { IconTile } from '@/shared/ui/icon-tile';

type SupportCardProps = Readonly<{
  variant?: 'full' | 'compact';
  className?: string;
}>;

export function SupportCard({ variant = 'full', className }: SupportCardProps) {
  const t = useTranslations('SupportCard');

  if (variant === 'compact') {
    return (
      <Card tone="brand" className={`p-5 lg:p-6 ${className ?? ''}`}>
        <p className="text-body-l-medium">{t('compactTitle')}</p>
        <a href={EXTERNAL_LINKS.hotline} className="mt-2 block text-number-l lg:mt-3 lg:text-h2">
          1414
        </a>
        <p className="mt-2 text-body-s text-brand-tint lg:mt-3 lg:text-body-m">{t('compactText')}</p>
      </Card>
    );
  }

  return (
    <Card tone="brand" className={`flex flex-col p-4 lg:p-8 ${className ?? ''}`}>
      <IconTile tone="inverse" size="card">
        <Phone />
      </IconTile>
      <h2 className="mt-4 text-h4 lg:mt-5 lg:text-h3">{t('title')}</h2>
      <p className="mt-3 text-body-m text-brand-tint">{t('text')}</p>
      <a href={EXTERNAL_LINKS.hotline} className="mt-3 text-number-l lg:mt-4 lg:text-number-xl">
        1414
      </a>
      <Button asChild variant="inverse" className="mt-3 h-10 text-body-l font-normal lg:mt-4">
        <Link href={ROUTES.feedback}>{t('action')}</Link>
      </Button>
    </Card>
  );
}
