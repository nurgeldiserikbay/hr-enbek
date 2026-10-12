import type { ChangeEvent } from 'react';

import { cn } from '@/shared/lib/styles';

type AnswerOptionProps = Readonly<{
  name: string;
  value: string;
  label: string;
  isChecked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}>;

export function AnswerOption({ name, value, label, isChecked, onChange }: AnswerOptionProps) {
  return (
    <label
      className={cn(
        'flex h-16 cursor-pointer items-center gap-3 rounded-xl border px-5 text-body-l-medium text-text-heading transition-colors',
        'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-primary-text',
        isChecked
          ? 'border-2 border-brand-primary bg-brand-tint'
          : 'border-border-default bg-surface-card hover:border-border-strong',
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={onChange}
        className="size-5 accent-brand-primary"
      />
      {label}
    </label>
  );
}
