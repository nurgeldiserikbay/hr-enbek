import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/styles';
import { Check } from '@/shared/ui/icon';

type CheckboxProps = Readonly<Omit<ComponentProps<'input'>, 'type'>>;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <span className={cn('relative inline-flex size-5 shrink-0', className)}>
      <input
        type="checkbox"
        className="peer size-5 cursor-pointer appearance-none rounded-sm border border-border-strong bg-surface-card checked:border-brand-primary checked:bg-brand-primary"
        {...props}
      />
      <Check
        aria-hidden="true"
        className="pointer-events-none absolute inset-0.5 size-4 text-brand-on-primary opacity-0 peer-checked:opacity-100"
      />
    </span>
  );
}
