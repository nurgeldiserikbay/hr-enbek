import { type ComponentProps, type ReactNode, useId } from 'react';

import { cn } from '@/shared/lib/styles';

type TextFieldProps = Omit<ComponentProps<'input'>, 'id'> &
  Readonly<{
    label: string;
    trailing?: ReactNode;
  }>;

export function TextField({ label, trailing, className, ...inputProps }: TextFieldProps) {
  const inputId = useId();

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className="text-body-s-medium text-text-heading">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={cn(
            'h-12 w-full rounded-lg border border-border-default bg-surface-card px-4 text-body-l text-text-heading',
            'placeholder:text-text-muted',
            trailing !== undefined && 'pr-13',
          )}
          {...inputProps}
        />
        {trailing !== undefined && <div className="absolute inset-y-0 right-4.25 flex items-center">{trailing}</div>}
      </div>
    </div>
  );
}
