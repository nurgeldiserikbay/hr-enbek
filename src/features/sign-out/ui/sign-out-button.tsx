'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { signOut } from '@/entities/sessions';
import { ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';

type SignOutButtonProps = Readonly<{
  accessToken: string | undefined;
}>;

export function SignOutButton({ accessToken }: SignOutButtonProps) {
  const t = useTranslations('SignOut');
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await signOut(accessToken);
          globalThis.location.replace(ROUTES.home);
        });
      }}
    >
      {t('action')}
    </Button>
  );
}
