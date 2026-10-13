'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useId, useState, useTransition } from 'react';

import type { SignatureChallenge } from '@/entities/sessions';
import { describeApiError, hasErrorCode, SERVICE_UNAVAILABLE_CODE } from '@/shared/api';
import { KEY_STORAGES, type KeyStorage, NcaLayerError, signWithNcaLayer } from '@/shared/lib/ncalayer';
import { Button } from '@/shared/ui/button';
import { Select } from '@/shared/ui/select';

import { renewChallenge, verifySignature } from '../api/staff-sign-in-api.ts';

const SESSION_EXPIRED_CODE = 'auth.2fa.challenge.expired';
const MAX_TIMER_DELAY_MS = 2_147_483_647;

type SignatureStepProps = Readonly<{
  challenge: SignatureChallenge;
  onChallengeRenewed: (challenge: SignatureChallenge) => void;
  onSigned: () => void;
  onRestart: (notice: string | null) => void;
}>;

const isKeyStorage = (value: string): value is KeyStorage => (KEY_STORAGES as readonly string[]).includes(value);

export function SignatureStep({ challenge, onChallengeRenewed, onSigned, onRestart }: SignatureStepProps) {
  const t = useTranslations('StaffSignature');
  const headingId = useId();
  const storageLabelId = useId();
  const [storage, setStorage] = useState<KeyStorage>('PKCS12');
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsExpired(true);
      },
      Math.min(Math.max(Date.parse(challenge.expiresAt) - Date.now(), 0), MAX_TIMER_DELAY_MS),
    );
    return () => {
      clearTimeout(timer);
    };
  }, [challenge.expiresAt]);

  const describeNcaLayerError = (cause: NcaLayerError): string | null => {
    switch (cause.reason) {
      case 'cancelled': {
        return null;
      }
      case 'unavailable': {
        return t('errors.ncaLayerUnavailable');
      }
      case 'timeout': {
        return t('errors.ncaLayerTimeout');
      }
      case 'rejected': {
        return cause.message === '' ? t('errors.unknown') : cause.message;
      }
    }
  };

  const handleFailure = (cause: unknown) => {
    if (hasErrorCode(cause, SESSION_EXPIRED_CODE)) {
      onRestart(t('sessionExpired'));
      return;
    }
    if (cause instanceof NcaLayerError) {
      setError(describeNcaLayerError(cause));
      return;
    }
    setError(
      describeApiError(
        cause,
        hasErrorCode(cause, SERVICE_UNAVAILABLE_CODE) ? t('errors.serviceUnavailable') : t('errors.unknown'),
      ),
    );
  };

  const run = (operation: () => Promise<void>) => {
    startTransition(async () => {
      try {
        setError(null);
        await operation();
      } catch (error_) {
        handleFailure(error_);
      }
    });
  };

  const sign = () => {
    run(async () => {
      const cms = await signWithNcaLayer(challenge.dataToSignBase64, storage);
      await verifySignature(cms);
      onSigned();
    });
  };

  const renew = () => {
    run(async () => {
      onChallengeRenewed(await renewChallenge());
    });
  };

  return (
    <section aria-labelledby={headingId} aria-busy={isPending} className="flex flex-col">
      <h2 id={headingId} className="text-h5 text-text-heading">
        {t('heading')}
      </h2>
      <p className="mt-2 text-body-s text-text-body">{t('description')}</p>

      <p id={storageLabelId} className="mt-6 text-body-s-medium text-text-heading">
        {t('storage')}
      </p>
      <Select
        className="mt-2"
        appearance="field"
        aria-labelledby={storageLabelId}
        placeholder={t('storage')}
        value={storage}
        options={KEY_STORAGES.map((value) => ({ value, label: t(`storages.${value}`) }))}
        onValueChange={(value) => {
          if (isKeyStorage(value)) setStorage(value);
        }}
      />

      {isExpired && <p className="mt-4 text-body-s text-text-body">{t('expired')}</p>}
      {error !== null && (
        <p role="alert" className="mt-4 text-body-s text-status-danger">
          {error}
        </p>
      )}

      {isExpired ? (
        <Button size="lg" className="mt-6 font-normal" disabled={isPending} onClick={renew}>
          {t('renew')}
        </Button>
      ) : (
        <Button size="lg" className="mt-6 font-normal" disabled={isPending} onClick={sign}>
          {t('sign')}
        </Button>
      )}
      <Button
        variant="ghost"
        size="lg"
        className="mt-3 font-normal"
        disabled={isPending}
        onClick={() => {
          onRestart(null);
        }}
      >
        {t('back')}
      </Button>
    </section>
  );
}
