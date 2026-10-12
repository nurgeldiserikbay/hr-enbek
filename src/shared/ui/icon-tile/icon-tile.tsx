import type { ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { tv } from '@/shared/lib/styles';

const iconTileVariants = tv({
  base: 'inline-flex shrink-0 items-center justify-center [&_svg]:stroke-[1.5px]',
  variants: {
    tone: {
      brand: 'bg-brand-tint text-brand-primary',
      danger: 'bg-status-danger-bg text-status-danger',
      warning: 'bg-status-warning-bg text-status-warning',
      inverse: 'bg-overlay-white-18 text-text-inverse',
    },
    size: {
      responsive: 'size-10 rounded-lg lg:size-13 lg:rounded-tile [&_svg]:size-5 lg:[&_svg]:size-6',
      card: 'size-10 rounded-lg lg:size-12 lg:rounded-tile [&_svg]:size-5 lg:[&_svg]:size-6',
      md: 'size-12 rounded-tile [&_svg]:size-6',
      sm: 'size-10 rounded-lg [&_svg]:size-5',
      xs: 'size-9 rounded-lg [&_svg]:size-[18px]',
    },
  },
  defaultVariants: {
    tone: 'brand',
    size: 'responsive',
  },
});

type IconTileProps = VariantProps<typeof iconTileVariants> &
  Readonly<{
    children: ReactNode;
    className?: string;
  }>;

export function IconTile({ tone, size, className, children }: IconTileProps) {
  return <span className={iconTileVariants({ tone, size, className })}>{children}</span>;
}
