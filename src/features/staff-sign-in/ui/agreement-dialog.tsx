'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';

import type { Agreement } from '../model/agreement.ts';

type AgreementDialogProps = Readonly<{
  agreement: Agreement;
  isOpen: boolean;
  onClose: () => void;
}>;

export function AgreementDialog({ agreement, isOpen, onClose }: AgreementDialogProps) {
  const t = useTranslations('StaffSignIn');
  const titleId = useId();

  return (
    <Dialog isOpen={isOpen} onClose={onClose} aria-labelledby={titleId}>
      <div className="flex min-h-0 flex-1 flex-col gap-6 p-6">
        <h2 id={titleId} className="text-h4 text-text-heading">
          {agreement.title}
        </h2>
        <div className="min-h-0 flex-1 overflow-y-auto text-body-m whitespace-pre-line text-text-body">
          {agreement.body}
        </div>
        <Button size="lg" onClick={onClose}>
          {t('agreementClose')}
        </Button>
      </div>
    </Dialog>
  );
}
