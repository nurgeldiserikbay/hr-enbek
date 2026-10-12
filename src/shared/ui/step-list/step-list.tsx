import type { ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { tv } from '@/shared/lib/styles';
import { Check } from '@/shared/ui/icon';

type StepState = 'done' | 'current' | 'upcoming';

const stepVariants = tv({
  slots: {
    item: 'flex items-center gap-3 rounded-xl py-3 pr-2 pl-3 lg:py-2.5',
    marker:
      'flex size-8 shrink-0 items-center justify-center rounded-full text-label lg:size-6 [&_svg]:size-4 lg:[&_svg]:size-3.5',
  },
  variants: {
    tone: {
      default: { item: 'text-body-s' },
      inverse: { item: 'py-2.5 text-body-m-medium lg:py-3' },
    },
    state: {
      done: {},
      current: {},
      upcoming: {},
    },
  },
  compoundVariants: [
    {
      tone: 'default',
      state: 'done',
      class: { item: 'text-text-heading', marker: 'bg-brand-primary text-brand-on-primary' },
    },
    {
      tone: 'default',
      state: 'current',
      class: {
        item: 'bg-brand-tint font-medium text-text-heading',
        marker: 'border-2 border-brand-primary text-brand-primary',
      },
    },
    {
      tone: 'default',
      state: 'upcoming',
      class: { item: 'text-text-muted', marker: 'bg-surface-page text-text-muted' },
    },
    {
      tone: 'inverse',
      state: 'done',
      class: { item: 'bg-overlay-white-12 text-text-inverse', marker: 'bg-surface-card text-brand-primary' },
    },
    {
      tone: 'inverse',
      state: 'current',
      class: { item: 'bg-surface-card text-text-heading', marker: 'bg-brand-primary text-brand-on-primary' },
    },
    {
      tone: 'inverse',
      state: 'upcoming',
      class: { item: 'bg-overlay-white-12 text-text-inverse', marker: 'bg-overlay-white-18 text-text-inverse' },
    },
  ],
  defaultVariants: {
    tone: 'default',
  },
});

interface Step {
  key: string;
  label: ReactNode;
  state: StepState;
}

type StepListProps = Pick<VariantProps<typeof stepVariants>, 'tone'> &
  Readonly<{
    steps: readonly Step[];
    className?: string;
  }>;

export function StepList({ steps, tone, className }: StepListProps) {
  return (
    <ol className={className}>
      {steps.map(({ key, label, state }, index) => {
        const styles = stepVariants({ tone, state });
        return (
          <li key={key} aria-current={state === 'current' ? 'step' : undefined} className={styles.item()}>
            <span className={styles.marker()}>
              {state === 'done' ? <Check aria-hidden="true" className="[&_*]:[stroke-width:2px]" /> : index + 1}
            </span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}
