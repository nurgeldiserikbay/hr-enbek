'use client';

import { useTranslations } from 'next-intl';
import { type SyntheticEvent, useState } from 'react';

import { Link, ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Eye, EyeOff } from '@/shared/ui/icon';
import { TextField } from '@/shared/ui/text-field';

const FIELD_NAMES = { login: 'login', password: 'password', agreement: 'agreement' } as const;

const preventUnsupportedSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
  event.preventDefault();
};

export function StaffSignInForm() {
  const t = useTranslations('StaffSignIn');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);
  const PasswordToggleIcon = isPasswordVisible ? Eye : EyeOff;

  return (
    <form className="flex flex-col" autoComplete="on" onSubmit={preventUnsupportedSubmit}>
      <TextField
        label={t('login')}
        name={FIELD_NAMES.login}
        placeholder={t('loginPlaceholder')}
        autoComplete="username"
        required
      />
      <TextField
        className="mt-6"
        label={t('password')}
        name={FIELD_NAMES.password}
        type={isPasswordVisible ? 'text' : 'password'}
        placeholder={t('passwordPlaceholder')}
        autoComplete="current-password"
        required
        trailing={
          <button
            type="button"
            aria-pressed={isPasswordVisible}
            aria-label={t('showPassword')}
            className="flex cursor-pointer rounded-sm text-text-body hover:text-text-heading"
            onClick={() => {
              setIsPasswordVisible((isVisible) => !isVisible);
            }}
          >
            <PasswordToggleIcon aria-hidden="true" className="size-5" />
          </button>
        }
      />
      <div className="mt-6 flex items-start gap-2 py-2 text-body-s">
        <Checkbox
          id="staff-sign-in-agreement"
          name={FIELD_NAMES.agreement}
          checked={isAgreementAccepted}
          onChange={(event) => {
            setIsAgreementAccepted(event.target.checked);
          }}
        />
        <p>
          <label htmlFor="staff-sign-in-agreement" className="cursor-pointer text-text-heading">
            {t('agreementPrefix')}
          </label>{' '}
          <Link href={ROUTES.helpAgreements} className="ml-2 text-text-legal-link hover:underline">
            {t('agreementLink')}
          </Link>
        </p>
      </div>
      <Button type="submit" size="lg" className="mt-6 font-normal" disabled={!isAgreementAccepted}>
        {t('submit')}
      </Button>
    </form>
  );
}
