import type { ComponentProps, ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { tv } from '@/shared/lib/styles';

import { Card } from '../card/card.tsx';
import { IconTile } from '../icon-tile/icon-tile.tsx';

const itemRowVariants = tv({
  slots: {
    root: 'flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4',
    title: 'text-text-heading',
    description: 'mt-1 lg:mt-0.5',
    main: 'flex flex-1 gap-3 lg:items-center lg:gap-4',
  },
  variants: {
    align: {
      center: {},
      start: { main: 'lg:items-start lg:gap-[18px]' },
    },
    size: {
      md: {
        root: 'p-4 lg:px-5 lg:py-[21px]',
        main: 'flex-col items-start gap-4 lg:flex-row',
        title: 'text-h5',
        description: 'text-body-m text-text-body',
      },
      sm: {
        root: 'p-4',
        main: 'flex-col items-start lg:flex-row',
        title: 'text-body-m-semibold lg:truncate',
        description: 'text-label font-normal text-text-muted lg:text-caption lg:leading-4',
      },
    },
  },
  compoundVariants: [
    {
      align: 'start',
      class: { main: 'flex-row items-start gap-4', description: 'text-body-m' },
    },
  ],
  defaultVariants: {
    align: 'center',
    size: 'md',
  },
});

type ItemRowProps = VariantProps<typeof itemRowVariants> &
  Readonly<{
    icon: ReactNode;
    iconTone?: ComponentProps<typeof IconTile>['tone'];
    iconSize?: ComponentProps<typeof IconTile>['size'];
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    children?: ReactNode;
    className?: string;
  }>;

export function ItemRow({
  icon,
  iconTone,
  iconSize,
  title,
  description,
  actions,
  size,
  align,
  children,
  className,
}: ItemRowProps) {
  const styles = itemRowVariants({ size, align });

  return (
    <Card radius="md" className={styles.root({ className })}>
      <div className={styles.main()}>
        <IconTile tone={iconTone} size={iconSize ?? (size === 'sm' ? 'xs' : 'card')}>
          {icon}
        </IconTile>
        <div className="min-w-0 flex-1">
          <p className={styles.title()}>{title}</p>
          {description !== undefined && <p className={styles.description()}>{description}</p>}
          {children}
        </div>
      </div>
      {actions !== undefined && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </Card>
  );
}
