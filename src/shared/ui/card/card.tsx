import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { tv } from '@/shared/lib/styles';

const cardVariants = tv({
  variants: {
    tone: {
      card: 'bg-surface-card',
      soft: 'bg-surface-soft',
      brand: 'bg-brand-primary text-text-inverse',
      dark: 'bg-surface-dark text-text-inverse',
    },
    radius: {
      md: 'rounded-xl',
      lg: 'rounded-2xl',
    },
  },
  defaultVariants: {
    tone: 'card',
    radius: 'lg',
  },
});

type CardProps = ComponentProps<'div'> &
  VariantProps<typeof cardVariants> & {
    asChild?: boolean;
  };

export function Card({ asChild = false, tone, radius, className, ...props }: CardProps) {
  const Component = asChild ? Slot : 'div';

  return <Component className={cardVariants({ tone, radius, className })} {...props} />;
}
