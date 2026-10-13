import { getTranslations } from 'next-intl/server';

import { PassportSignInLink } from '@/features/passport-sign-in';
import { Link, ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { AuthShell } from '@/widgets/auth-shell';

const PASSPORT_ERROR_KEYS = {
  'auth.sso.state.invalid': 'flowExpired',
  'auth.passport.token.invalid': 'passportSession',
  'auth.passport.token.expired': 'passportSession',
  'auth.passport.user.inactive': 'passportInactive',
  'auth.passport.unavailable': 'passportUnavailable',
} as const;

type PassportErrorCode = keyof typeof PASSPORT_ERROR_KEYS;

const isKnownError = (code: string): code is PassportErrorCode => Object.hasOwn(PASSPORT_ERROR_KEYS, code);

const resolveErrorKey = (code: string | undefined) => {
  if (code === undefined) return null;
  return isKnownError(code) ? PASSPORT_ERROR_KEYS[code] : 'unknown';
};

type SignInPageProps = Readonly<{
  errorCode: string | undefined;
}>;

export async function SignInPage({ errorCode }: SignInPageProps) {
  const t = await getTranslations('SignInPage');
  const errorKey = resolveErrorKey(errorCode);

  return (
    <AuthShell>
      <h1 className="mt-12 text-h3 leading-[32px] text-text-heading">{t('heading')}</h1>
      <p className="mt-2 text-body-s text-text-body">{t('description')}</p>
      {errorKey !== null && (
        <p role="alert" className="mt-6 text-body-s text-status-danger">
          {t(`errors.${errorKey}`)}
        </p>
      )}
      <div className="mt-6 flex flex-col gap-3">
        <PassportSignInLink />
        <p className="text-caption text-text-body">{t('passportHint')}</p>
        <Button asChild variant="secondary" size="lg" className="mt-3 font-normal">
          <Link href={ROUTES.staffLogin}>{t('staff')}</Link>
        </Button>
        <p className="text-caption text-text-body">{t('staffHint')}</p>
      </div>
    </AuthShell>
  );
}
