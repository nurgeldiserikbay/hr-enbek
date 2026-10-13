'use client';

import { useLocale, useTranslations } from 'next-intl';

import { AUTH_API } from '@/entities/sessions';
import { Button } from '@/shared/ui/button';

export function PassportSignInLink() {
  const t = useTranslations('PassportSignIn');
  const locale = useLocale();

  return (
    <Button asChild size="lg" className="font-normal">
      <a href={`${AUTH_API.passportStart}?locale=${locale}`}>{t('action')}</a>
    </Button>
  );
}
