'use client';

import { Mail, Send, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ComponentProps, createContext, type ReactNode, use, useCallback, useId, useState } from 'react';

import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { Phone } from '@/shared/ui/icon';
import { Select } from '@/shared/ui/select';
import { TextArea } from '@/shared/ui/text-area';
import { TextField } from '@/shared/ui/text-field';

import { sendFeedback } from '../api/send-feedback.ts';
import { feedbackRequestSchema } from '../model/feedback-request.ts';

interface FeedbackRegion {
  value: string;
  label: string;
}

const OpenFeedbackContext = createContext<(() => void) | undefined>(undefined);

const FIELD_ICON = 'size-6 translate-x-0.5 text-text-muted';
const FIELD = feedbackRequestSchema.keyof().enum;
const IIN_PATTERN = String.raw`\d{12}`;

type FeedbackDialogProviderProps = Readonly<{
  regions: readonly FeedbackRegion[];
  children: ReactNode;
}>;

export function FeedbackDialogProvider({ regions, children }: FeedbackDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <OpenFeedbackContext value={open}>
      {children}
      <FeedbackDialog regions={regions} isOpen={isOpen} onClose={close} />
    </OpenFeedbackContext>
  );
}

export function FeedbackTrigger({ onClick, ...props }: Readonly<Omit<ComponentProps<'button'>, 'type'>>) {
  const openFeedback = use(OpenFeedbackContext);

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={(event) => {
        onClick?.(event);
        openFeedback?.();
      }}
      {...props}
    />
  );
}

type FeedbackDialogProps = Readonly<{
  regions: readonly FeedbackRegion[];
  isOpen: boolean;
  onClose: () => void;
}>;

export function FeedbackDialog({ regions, isOpen, onClose }: FeedbackDialogProps) {
  const t = useTranslations('Feedback');
  const titleId = useId();
  const regionLabelId = useId();

  const submit = async (formData: FormData) => {
    const request = feedbackRequestSchema.safeParse(Object.fromEntries(formData));
    if (!request.success) return;
    await sendFeedback(request.data);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} aria-labelledby={titleId}>
      <form action={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-4 px-4 pt-6 sm:px-6 sm:pt-8.25">
          <h2 id={titleId} className="text-h4 text-text-heading">
            {t('title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-my-2 -mr-1.5 -ml-2 rounded-md p-2 text-text-heading hover:bg-surface-page"
          >
            <X aria-hidden="true" className="size-5.5" />
            <span className="sr-only">{t('close')}</span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pt-6 pb-6 sm:px-6 sm:pt-8.25">
          <TextField
            labelSize="sm"
            label={t('name')}
            placeholder={t('namePlaceholder')}
            name={FIELD.name}
            autoComplete="name"
          />
          <div className="flex flex-col gap-2">
            <span id={regionLabelId} className="text-label text-text-heading">
              {t('region')}
            </span>
            <Select
              appearance="field"
              name={FIELD.region}
              aria-labelledby={regionLabelId}
              placeholder={t('regionPlaceholder')}
              options={regions}
            />
          </div>
          <TextField
            labelSize="sm"
            label={t('iin')}
            placeholder={t('iinPlaceholder')}
            name={FIELD.iin}
            inputMode="numeric"
            pattern={IIN_PATTERN}
            maxLength={12}
          />
          <TextField
            labelSize="sm"
            label={t('email')}
            placeholder={t('emailPlaceholder')}
            name={FIELD.email}
            type="email"
            autoComplete="email"
            trailing={<Mail aria-hidden="true" className={FIELD_ICON} />}
          />
          <TextField
            labelSize="sm"
            label={t('phone')}
            placeholder={t('phonePlaceholder')}
            name={FIELD.phone}
            type="tel"
            autoComplete="tel"
            required
            trailing={<Phone aria-hidden="true" className={FIELD_ICON} />}
          />
          <TextField labelSize="sm" label={t('subject')} placeholder={t('subjectPlaceholder')} name={FIELD.subject} />
          <TextArea label={t('message')} placeholder={t('messagePlaceholder')} name={FIELD.message} />
        </div>

        <div className="mx-4 flex justify-end border-t border-border-default py-6 sm:mx-6">
          <Button type="submit" className="h-9 rounded-md px-3 text-body-s font-normal">
            <Send aria-hidden="true" className="size-4" />
            {t('submit')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
