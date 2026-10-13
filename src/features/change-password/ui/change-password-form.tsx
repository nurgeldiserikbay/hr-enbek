'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type SyntheticEvent, useId, useState, useTransition } from 'react';

import { SESSION_QUERY_KEY } from '@/entities/sessions';
import { describeApiError, hasErrorCode, SERVICE_UNAVAILABLE_CODE } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { TextField } from '@/shared/ui/text-field';

import { changePassword } from '../api/change-password.ts';

const FIELD_NAMES = { current: 'currentPassword', next: 'newPassword', confirmation: 'confirmation' } as const;

const readField = (data: FormData, name: string) => {
  const value = data.get(name);
  return typeof value === 'string' ? value : '';
};

type ChangePasswordFormProps = Readonly<{
  accessToken: string;
}>;

export function ChangePasswordForm({ accessToken }: ChangePasswordFormProps) {
  const t = useTranslations('ChangePassword');
  const headingId = useId();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const currentPassword = readField(data, FIELD_NAMES.current);
    const newPassword = readField(data, FIELD_NAMES.next);
    if (newPassword !== readField(data, FIELD_NAMES.confirmation)) {
      setError(t('mismatch'));
      return;
    }
    startTransition(async () => {
      try {
        setError(null);
        await changePassword(accessToken, { currentPassword, newPassword });
        await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
      } catch (error_) {
        setError(
          describeApiError(
            error_,
            hasErrorCode(error_, SERVICE_UNAVAILABLE_CODE) ? t('errors.serviceUnavailable') : t('errors.unknown'),
          ),
        );
      }
    });
  };

  return (
    <form aria-labelledby={headingId} aria-busy={isPending} className="flex flex-col" onSubmit={submit}>
      <h2 id={headingId} className="text-h4 text-text-heading">
        {t('heading')}
      </h2>
      <p className="mt-2 text-body-s text-text-body">{t('description')}</p>
      <TextField
        className="mt-6"
        label={t('current')}
        name={FIELD_NAMES.current}
        type="password"
        autoComplete="current-password"
        required
      />
      <TextField
        className="mt-6"
        label={t('next')}
        name={FIELD_NAMES.next}
        type="password"
        autoComplete="new-password"
        minLength={12}
        required
      />
      <TextField
        className="mt-6"
        label={t('confirmation')}
        name={FIELD_NAMES.confirmation}
        type="password"
        autoComplete="new-password"
        required
      />
      {error !== null && (
        <p role="alert" className="mt-4 text-body-s text-status-danger">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="mt-6 font-normal" disabled={isPending}>
        {t('submit')}
      </Button>
    </form>
  );
}
