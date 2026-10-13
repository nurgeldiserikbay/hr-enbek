import { type ComponentProps, useId } from 'react';

import { cn } from '@/shared/lib/styles';

type TextAreaProps = Omit<ComponentProps<'textarea'>, 'id'> &
  Readonly<{
    label: string;
  }>;

export function TextArea({ label, className, ...textareaProps }: TextAreaProps) {
  const textareaId = useId();

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={textareaId} className="text-label text-text-heading">
        {label}
      </label>
      <textarea
        id={textareaId}
        className="h-27.5 w-full resize-none rounded-lg border border-border-default bg-surface-card px-4 py-2.5 text-body-s text-text-heading placeholder:text-text-muted"
        {...textareaProps}
      />
    </div>
  );
}
