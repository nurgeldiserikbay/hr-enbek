'use client';

import { useLocale, useTranslations } from 'next-intl';
import { type SyntheticEvent, useEffect, useState, useTransition } from 'react';

import type { SignatureChallenge } from '@/entities/sessions';
import { describeApiError, hasErrorCode, SERVICE_UNAVAILABLE_CODE } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Eye, EyeOff } from '@/shared/ui/icon';
import { TextField } from '@/shared/ui/text-field';

import { getAgreement, submitCredentials } from '../api/staff-sign-in-api.ts';
import type { Agreement } from '../model/agreement.ts';
import { AgreementDialog } from './agreement-dialog.tsx';

const FIELD_NAMES = { login: 'login', password: 'password', agreement: 'agreement' } as const;
const AGREEMENT_OUTDATED_CODE = 'auth.agreement.outdated';

type StaffSignInFormProps = Readonly<{
  notice?: string | null;
  onChallenge: (challenge: SignatureChallenge) => void;
}>;

const readField = (form: HTMLFormElement, name: string) => {
  const value = new FormData(form).get(name);
  return typeof value === 'string' ? value : '';
};

export function StaffSignInForm({ notice = null, onChallenge }: StaffSignInFormProps) {
  const t = useTranslations('StaffSignIn');
  const locale = useLocale();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAgreementAccepted, setIsAgreementAccepted] = useState(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [agreementRequest, setAgreementRequest] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, startSubmitting] = useTransition();
  const PasswordToggleIcon = isPasswordVisible ? Eye : EyeOff;

  useEffect(() => {
    let isCurrent = true;
    getAgreement(locale).then(
      (loaded) => {
        if (isCurrent) setAgreement(loaded);
      },
      () => {
        if (isCurrent) setError(t('agreementUnavailable'));
      },
    );
    return () => {
      isCurrent = false;
    };
  }, [locale, agreementRequest, t]);

  const describeError = (cause: unknown) =>
    describeApiError(
      cause,
      hasErrorCode(cause, SERVICE_UNAVAILABLE_CODE) ? t('errors.serviceUnavailable') : t('errors.unknown'),
    );

  const submit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (agreement === null) return;
    const form = event.currentTarget;
    const credentials = {
      login: readField(form, FIELD_NAMES.login),
      password: readField(form, FIELD_NAMES.password),
      agreement,
    };
    startSubmitting(async () => {
      try {
        setError(null);
        onChallenge(await submitCredentials(credentials));
      } catch (error_) {
        setError(describeError(error_));
        if (hasErrorCode(error_, AGREEMENT_OUTDATED_CODE)) {
          setIsAgreementAccepted(false);
          setAgreementRequest((request) => request + 1);
        }
      }
    });
  };

  const message = error ?? notice;

  return (
    <form className="flex flex-col" autoComplete="on" onSubmit={submit} aria-busy={isSubmitting}>
      <p className="mb-6 text-body-s text-text-body">{t('description')}</p>
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
      <div className="mt-5 flex items-start gap-2 py-2 text-body-s">
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
          <button
            type="button"
            className="ml-2 cursor-pointer text-text-legal-link hover:underline disabled:cursor-default"
            disabled={agreement === null}
            onClick={() => {
              setIsAgreementOpen(true);
            }}
          >
            {t('agreementLink')}
          </button>
        </p>
      </div>
      {message !== null && (
        <p role="alert" className="mt-3 text-body-s text-status-danger">
          {message}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        className="mt-5 font-normal"
        disabled={!isAgreementAccepted || agreement === null || isSubmitting}
      >
        {t('submit')}
      </Button>
      {agreement !== null && (
        <AgreementDialog
          agreement={agreement}
          isOpen={isAgreementOpen}
          onClose={() => {
            setIsAgreementOpen(false);
          }}
        />
      )}
    </form>
  );
}
