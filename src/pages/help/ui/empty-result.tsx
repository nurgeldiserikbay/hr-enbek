import { SearchX } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card } from '@/shared/ui/card';

export function EmptyResult() {
  const t = useTranslations('HelpPage');

  return (
    <Card className="flex flex-col items-center gap-3 p-10 text-center">
      <SearchX aria-hidden="true" className="size-8 text-text-muted" />
      <p className="text-body-l-medium text-text-heading">{t('empty')}</p>
    </Card>
  );
}
