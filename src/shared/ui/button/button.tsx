import { Slot } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { tv } from '@/shared/lib/styles';

const buttonVariants = tv({
  base: [
    'inline-flex items-center justify-center gap-2 rounded-lg whitespace-nowrap',
    'transition-colors disabled:pointer-events-none disabled:opacity-50',
  ],
  variants: {
    variant: {
      primary: 'bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover',
      secondary: 'border border-border-strong bg-surface-card text-text-heading hover:bg-surface-soft',
      ghost: 'text-brand-primary hover:bg-brand-tint',
      inverse: 'bg-surface-card text-text-heading hover:bg-surface-soft',
      overlay: 'bg-overlay-white-12 text-text-inverse hover:bg-overlay-white-18',
    },
    size: {
      sm: 'h-8 px-3 text-body-s-medium',
      md: 'h-10 px-4 text-body-m-medium',
      lg: 'h-12 px-6 text-body-l-medium',
      icon: 'size-12 rounded-full',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ asChild = false, variant, size, className, type = 'button', ...props }: ButtonProps) {
  const classes = buttonVariants({ variant, size, className });

  if (asChild) {
    return <Slot className={classes} {...props} />;
  }

  return <button className={classes} type={type} {...props} />;
}
