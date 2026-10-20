import type { ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { tv } from '@/shared/lib/styles';

const tagVariants = tv({
  base: 'inline-flex shrink-0 items-center gap-1 self-start rounded-full whitespace-nowrap [&_svg]:size-3',
  variants: {
    tone: {
      neutral: 'bg-surface-page text-text-heading',
      success: 'bg-brand-tint text-brand-primary',
      warning: 'bg-status-warning-bg text-status-warning',
      danger: 'bg-status-danger-bg text-status-danger',
    },
    size: {
      md: 'h-7 px-3 text-body-s',
      sm: 'h-6 px-2 text-label',
    },
  },
  compoundVariants: [{ tone: 'neutral', size: 'sm', class: 'text-text-body' }],
  defaultVariants: {
    tone: 'neutral',
    size: 'md',
  },
});

type TagProps = VariantProps<typeof tagVariants> &
  Readonly<{
    children: ReactNode;
    className?: string;
    lang?: string | undefined;
  }>;

export function Tag({ tone, size, className, lang, children }: TagProps) {
  return (
    <span lang={lang} className={tagVariants({ tone, size, className })}>
      {children}
    </span>
  );
}
