'use client';

import * as RadixSelect from '@radix-ui/react-select';

import { cn } from '@/shared/lib/styles';
import { ChevronsUpDown } from '@/shared/ui/icon';

interface SelectOption {
  value: string;
  label: string;
}

type SelectProps = Readonly<{
  options: readonly SelectOption[];
  placeholder: string;
  value?: string;
  onValueChange?: (value: string) => void;
  'aria-labelledby'?: string;
  className?: string;
  contentClassName?: string;
}>;

export function Select({
  options,
  placeholder,
  value,
  onValueChange,
  'aria-labelledby': labelledBy,
  className,
  contentClassName,
}: SelectProps) {
  return (
    <RadixSelect.Root {...(value === undefined ? {} : { value })} {...(onValueChange ? { onValueChange } : {})}>
      <RadixSelect.Trigger
        aria-labelledby={labelledBy}
        className={cn(
          `inline-flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border-strong bg-surface-card px-3 text-left text-body-s text-text-heading data-placeholder:text-text-placeholder max-lg:h-[42px]`,
          className,
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronsUpDown aria-hidden="true" className="size-4 text-text-heading" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={8}
          className={cn(
            `z-30 max-h-75 w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-border-default bg-surface-card shadow-floating`,
            contentClassName,
          )}
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className={`cursor-pointer rounded-md px-3 py-4 text-body-s text-text-heading outline-none data-highlighted:bg-surface-soft data-[state=checked]:text-brand-primary`}
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
