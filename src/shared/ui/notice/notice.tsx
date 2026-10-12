import type { ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { tv } from '@/shared/lib/styles';

const noticeVariants = tv({
  base: 'flex gap-3 rounded-xl p-4 [&>svg]:mt-0.5 [&>svg]:size-5 [&>svg]:shrink-0',
  variants: {
    tone: {
      warning: 'bg-status-warning-bg text-body-s-medium text-status-warning-strong [&>svg]:text-status-warning',
      neutral: 'border border-border-default bg-surface-soft text-body-s text-text-body [&>svg]:text-text-body',
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
});

type NoticeProps = VariantProps<typeof noticeVariants> &
  Readonly<{
    icon: ReactNode;
    title?: string;
    children: ReactNode;
    className?: string;
  }>;

export function Notice({ tone, icon, title, children, className }: NoticeProps) {
  return (
    <div className={noticeVariants({ tone, className })}>
      {icon}
      <div>
        {title !== undefined && <p className="mb-1 text-body-s-medium text-text-heading">{title}</p>}
        {children}
      </div>
    </div>
  );
}
