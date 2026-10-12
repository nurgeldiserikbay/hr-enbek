import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/styles';

type ChipProps = ComponentProps<'button'> & {
  asChild?: boolean;
  isActive?: boolean;
};

export function Chip({ asChild = false, isActive = false, className, type = 'button', ...props }: ChipProps) {
  const classes = cn(
    'inline-flex min-h-10 items-center rounded-full border px-[18px] py-1.5 text-body-s transition-colors',
    isActive
      ? 'border-brand-primary bg-brand-primary text-brand-on-primary'
      : 'border-border-default bg-surface-card text-text-heading hover:border-border-strong',
    className,
  );

  if (asChild) {
    return <Slot className={classes} aria-current={isActive ? 'true' : undefined} {...props} />;
  }

  return <button className={classes} type={type} aria-pressed={isActive} {...props} />;
}
