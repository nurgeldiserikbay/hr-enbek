import type { ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { Link } from '@/shared/config';
import { tv } from '@/shared/lib/styles';

import { Card } from '../card/card.tsx';
import { IconTile } from '../icon-tile/icon-tile.tsx';

const featureCardVariants = tv({
  slots: {
    root: 'relative flex p-4 lg:p-6',
    head: 'flex items-start justify-between gap-3',
    body: '',
    title: 'text-text-heading',
    description: 'mt-1 text-body-s text-text-body lg:text-body-m',
  },
  variants: {
    layout: {
      stack: {
        root: 'flex-col',
        body: 'mt-4 lg:mt-5',
        title: 'text-h4',
        description: 'text-body-m lg:text-body-m',
      },
      responsive: {
        root: 'items-center gap-3 lg:flex-col lg:items-stretch lg:gap-0',
        head: 'shrink-0 flex-col items-center gap-2 lg:flex-row lg:items-start lg:gap-3',
        body: 'lg:mt-5',
        title: 'text-body-m-medium lg:text-h4',
        description: 'lg:text-body-l',
      },
    },
    descriptionSize: {
      md: {},
      lg: { description: 'text-body-l lg:text-body-l' },
    },
  },
  defaultVariants: {
    layout: 'stack',
    descriptionSize: 'md',
  },
});

type FeatureCardProps = VariantProps<typeof featureCardVariants> &
  Readonly<{
    icon: ReactNode;
    title: string;
    description?: string;
    badge?: ReactNode;
    href?: string;
    contentLang?: string | undefined;
    children?: ReactNode;
    className?: string;
  }>;

export function FeatureCard({
  icon,
  title,
  description,
  badge,
  href,
  contentLang,
  layout,
  descriptionSize,
  children,
  className,
}: FeatureCardProps) {
  const styles = featureCardVariants({ layout, descriptionSize });

  return (
    <Card asChild className={styles.root({ className })}>
      <article>
        <div className={styles.head()}>
          <IconTile size={layout === 'responsive' ? 'responsive' : 'card'}>{icon}</IconTile>
          {badge}
        </div>
        <div className={styles.body()}>
          <h3 lang={contentLang} className={styles.title()}>
            {href === undefined ? (
              title
            ) : (
              <Link
                href={href}
                className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-brand-primary-text"
              >
                {title}
              </Link>
            )}
          </h3>
          {description !== undefined && (
            <p lang={contentLang} className={styles.description()}>
              {description}
            </p>
          )}
        </div>
        {children !== undefined && <div className="mt-4 lg:mt-5">{children}</div>}
      </article>
    </Card>
  );
}
