import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { AUTH_API, SIGN_IN_CHOICE_PARAM } from '@/entities/sessions';
import { SignInPage } from '@/pages/sign-in';
import { resolveLocale } from '@/shared/config';

export async function generateMetadata({ params }: Readonly<PageProps<'/[locale]/login'>>): Promise<Metadata> {
  const t = await getTranslations({ locale: await resolveLocale(params), namespace: 'SignInPage' });
  return { title: t('title'), robots: { index: false, follow: false } };
}

export default async function Page({ params, searchParams }: Readonly<PageProps<'/[locale]/login'>>) {
  const locale = await resolveLocale(params);
  const query = await searchParams;
  const errorCode = typeof query['error'] === 'string' ? query['error'] : undefined;
  if (errorCode === undefined && query[SIGN_IN_CHOICE_PARAM] === undefined) {
    redirect(`${AUTH_API.passportStart}?locale=${locale}`);
  }
  return <SignInPage errorCode={errorCode} />;
}
