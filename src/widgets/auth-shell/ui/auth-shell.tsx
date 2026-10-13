import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { getLabourInspections } from '@/entities/labour-inspections';
import { FeedbackDialogProvider, FeedbackTrigger } from '@/features/send-feedback';
import { LanguageMenu } from '@/features/switch-language';
import { Link, MAIN_CONTENT_ID, ROUTES } from '@/shared/config';
import { CircleHelpSmall } from '@/shared/ui/icon';
import { Logo } from '@/shared/ui/logo';

import { BrandBackdrop } from './brand-backdrop.tsx';

type AuthShellProps = Readonly<{
  children: ReactNode;
}>;

export async function AuthShell({ children }: AuthShellProps) {
  const t = await getTranslations('AuthShell');
  const tNavigation = await getTranslations('Navigation');
  const inspections = await getLabourInspections();
  const regions = inspections.map(({ regionId: value, regionName: label }) => ({ value, label }));

  return (
    <FeedbackDialogProvider regions={regions}>
      <div className="relative isolate flex min-h-dvh bg-linear-to-b from-brand-primary to-brand-primary-text">
        <div className="absolute inset-0 -z-20 hidden overflow-hidden lg:block">
          <BrandBackdrop />
        </div>
        <div className="hidden flex-1 lg:block" />

        <div className="relative flex min-h-dvh w-full flex-col bg-surface-card lg:w-1/2 lg:rounded-l-2xl lg:before:absolute lg:before:inset-y-0 lg:before:right-0 lg:before:-left-1 lg:before:-z-10 lg:before:rounded-l-2xl lg:before:border-l lg:before:border-surface-card/35 lg:before:bg-surface-card/17">
          <header className="flex items-start justify-between gap-2 px-4 pt-4 sm:gap-4 lg:px-6 lg:pt-6">
            <Link href={ROUTES.home} aria-label={tNavigation('home')} className="text-brand-logo-ink">
              <Logo />
            </Link>
            <div className="mt-1.25 flex items-center gap-2">
              <FeedbackTrigger className="flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border-strong bg-surface-card px-2 text-caption whitespace-nowrap text-text-heading hover:bg-surface-soft sm:pr-3 sm:pl-2.5">
                <CircleHelpSmall aria-hidden="true" className="size-4" />
                <span className="sr-only sm:not-sr-only sm:[width:calc-size(max-content,round(up,size,1px))]">
                  {t('support')}
                </span>
              </FeedbackTrigger>
              <LanguageMenu tone="bordered" />
            </div>
          </header>

          <main id={MAIN_CONTENT_ID} className="mx-auto w-full max-w-118 px-4 pt-12 pb-12 sm:pt-24.5 lg:px-0">
            <p className="text-center text-body-s tracking-[-0.02px] text-text-heading">{t('intro')}</p>
            {children}
          </main>
        </div>
      </div>
    </FeedbackDialogProvider>
  );
}
