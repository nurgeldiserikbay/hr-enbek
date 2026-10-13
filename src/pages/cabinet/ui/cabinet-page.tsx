'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { isSessionMissing, type SessionUser, SIGN_IN_CHOICE_PARAM, useSession } from '@/entities/sessions';
import { ChangePasswordForm } from '@/features/change-password';
import { SignOutButton } from '@/features/sign-out';
import { MAIN_CONTENT_ID, ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Logo } from '@/shared/ui/logo';

function UserDetails({ user }: Readonly<{ user: SessionUser }>) {
  const t = useTranslations('CabinetPage');
  const listOrEmpty = (items: readonly string[]) => (items.length > 0 ? items.join(', ') : t('empty'));
  const rows = [
    { key: 'authType', value: t(`authTypes.${user.authType}`) },
    { key: 'iin', value: user.iinMasked ?? t('empty') },
    { key: 'roles', value: listOrEmpty(user.roles.map((role) => role.code)) },
    { key: 'permissions', value: listOrEmpty(user.permissions) },
    { key: 'employers', value: listOrEmpty(user.employerBins) },
  ] as const;

  return (
    <dl className="mt-8 grid gap-4 sm:grid-cols-[max-content_1fr] sm:gap-x-8">
      {rows.map(({ key, value }) => (
        <div key={key} className="contents">
          <dt className="text-body-s-medium text-text-heading">{t(`fields.${key}`)}</dt>
          <dd className="text-body-s break-words text-text-body max-sm:-mt-3">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CabinetPage() {
  const t = useTranslations('CabinetPage');
  const locale = useLocale();
  const router = useRouter();
  const session = useSession();
  const isSignedOut = session.isError && isSessionMissing(session.error);

  useEffect(() => {
    if (isSignedOut) router.replace(`/${locale}${ROUTES.login}?${SIGN_IN_CHOICE_PARAM}`);
  }, [isSignedOut, locale, router]);

  return (
    <div className="min-h-dvh bg-surface-page">
      <header className="flex items-center justify-between gap-4 bg-surface-card px-4 py-4 lg:px-6">
        <span className="text-brand-logo-ink">
          <Logo />
        </span>
        {session.data !== undefined && <SignOutButton accessToken={session.data.accessToken} />}
      </header>
      <main id={MAIN_CONTENT_ID} className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-h2 text-text-heading">{t('heading')}</h1>
        {session.isPending && (
          <p role="status" className="mt-6 text-body-m text-text-body">
            {t('loading')}
          </p>
        )}
        {session.isError && !isSignedOut && (
          <div className="mt-6 flex flex-col items-start gap-4">
            <p role="alert" className="text-body-m text-status-danger">
              {t('failed')}
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                void session.refetch();
              }}
            >
              {t('retry')}
            </Button>
          </div>
        )}
        {session.data?.passwordChangeRequired === true && (
          <div className="mt-8 rounded-xl bg-surface-card p-6">
            <ChangePasswordForm accessToken={session.data.accessToken} />
          </div>
        )}
        {session.data?.passwordChangeRequired === false && (
          <div className="mt-8 rounded-xl bg-surface-card p-6">
            <p className="text-body-l text-text-heading">
              {t('greeting', { name: session.data.user.displayName ?? session.data.user.login ?? '' })}
            </p>
            <UserDetails user={session.data.user} />
          </div>
        )}
      </main>
    </div>
  );
}
