'use client';

import * as RadixSelect from '@radix-ui/react-select';
import type { VariantProps } from 'tailwind-variants';

import { cn, tv } from '@/shared/lib/styles';
import { ChevronDown, ChevronsUpDown } from '@/shared/ui/icon';

const selectVariants = tv({
  slots: {
    trigger:
      'inline-flex w-full items-center justify-between gap-2 rounded-lg border bg-surface-card text-left text-text-heading',
    icon: 'size-4',
  },
  variants: {
    appearance: {
      compact: {
        trigger: 'h-11 border-border-strong px-3 text-body-s data-placeholder:text-text-placeholder max-lg:h-[42px]',
        icon: 'text-text-heading',
      },
      field: {
        trigger: 'h-12 border-border-default pr-3.5 pl-4 text-body-l data-placeholder:text-text-muted',
        icon: 'text-text-muted',
      },
    },
  },
  defaultVariants: {
    appearance: 'compact',
  },
});

interface SelectOption {
  value: string;
  label: string;
}

type SelectProps = VariantProps<typeof selectVariants> &
  Readonly<{
    options: readonly SelectOption[];
    placeholder: string;
    value?: string;
    onValueChange?: (value: string) => void;
    name?: string;
    'aria-labelledby'?: string;
    className?: string;
    contentClassName?: string;
  }>;

export function Select({
  options,
  placeholder,
  value,
  onValueChange,
  name,
  appearance,
  'aria-labelledby': labelledBy,
  className,
  contentClassName,
}: SelectProps) {
  const styles = selectVariants({ appearance });
  const Icon = appearance === 'field' ? ChevronDown : ChevronsUpDown;

  return (
    <RadixSelect.Root
      {...(value === undefined ? {} : { value })}
      {...(onValueChange ? { onValueChange } : {})}
      {...(name === undefined ? {} : { name })}
    >
      <RadixSelect.Trigger aria-labelledby={labelledBy} className={styles.trigger({ className })}>
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <Icon aria-hidden="true" className={styles.icon()} />
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
