import type { ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { tv } from '@/shared/lib/styles';
import { ChevronDown, Minus, Plus } from '@/shared/ui/icon';

const accordionVariants = tv({
  slots: {
    root: 'group rounded-2xl border border-transparent bg-surface-card',
    summary:
      'flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-body-l-medium text-text-heading lg:font-semibold [&::-webkit-details-marker]:hidden',
    body: 'px-4 pb-4',
  },
  variants: {
    variant: {
      faq: {
        root: 'open:border-brand-primary',
        summary: 'lg:px-7 lg:py-6 lg:text-h5',
        body: 'lg:-mt-2 lg:px-7 lg:pb-8',
      },
      plain: {
        summary: 'lg:px-6 lg:pt-5 lg:pb-4',
        body: 'lg:px-6 lg:pb-6',
      },
    },
  },
  defaultVariants: {
    variant: 'faq',
  },
});

type AccordionItemProps = VariantProps<typeof accordionVariants> &
  Readonly<{
    title: ReactNode;
    children: ReactNode;
    defaultOpen?: boolean;
    className?: string;
  }>;

export function AccordionItem({ title, children, defaultOpen = false, variant, className }: AccordionItemProps) {
  const styles = accordionVariants({ variant });

  return (
    <details open={defaultOpen} className={styles.root({ className })}>
      <summary className={styles.summary()}>
        {title}
        {variant === 'plain' ? (
          <ChevronDown
            aria-hidden="true"
            className="size-5 shrink-0 text-text-muted transition-transform group-open:rotate-180"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-page text-text-body group-open:bg-brand-primary group-open:text-brand-on-primary"
          >
            <Plus className="size-4 group-open:hidden" />
            <Minus className="hidden size-4 group-open:block" />
          </span>
        )}
      </summary>
      <div className={styles.body()}>{children}</div>
    </details>
  );
}
