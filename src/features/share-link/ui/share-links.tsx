'use client';

import { Link2, Mail, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { cn } from '@/shared/lib/styles';
import { Check } from '@/shared/ui/icon';

type ShareLinksProps = Readonly<{
  url: string;
  title: string;
  className?: string;
}>;

const SHARE_ACTION = cn(
  'inline-flex size-10 items-center justify-center rounded-full border border-border-default bg-surface-soft text-text-heading',
  'transition-colors hover:border-border-strong [&_svg]:size-4',
);

export function ShareLinks({ url, title, className }: ShareLinksProps) {
  const t = useTranslations('ShareLinks');
  const [isCopied, setIsCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
  };

  const telegramHref = `https://t.me/share/url?${new URLSearchParams({ url, text: title }).toString()}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <p className="text-body-s text-text-body">{t('title')}</p>
      <ul className="flex items-center gap-3">
        <li>
          <button
            type="button"
            className={SHARE_ACTION}
            aria-label={t('copy')}
            onClick={() => {
              void copyLink();
            }}
          >
            {isCopied ? <Check aria-hidden="true" className="text-brand-primary" /> : <Link2 aria-hidden="true" />}
          </button>
        </li>
        <li>
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className={SHARE_ACTION}
            aria-label={t('telegram')}
          >
            <Send aria-hidden="true" />
          </a>
        </li>
        <li>
          <a href={emailHref} className={SHARE_ACTION} aria-label={t('email')}>
            <Mail aria-hidden="true" />
          </a>
        </li>
      </ul>
      <p role="status" className="sr-only">
        {isCopied ? t('copied') : ''}
      </p>
    </div>
  );
}
