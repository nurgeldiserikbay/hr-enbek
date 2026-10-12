import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/styles';

type SectionHeaderProps = Readonly<{
  id?: string;
  title: string;
  accent?: string;
  description?: string;
  actions?: ReactNode;
  size?: 'lg' | 'md';
  titleClassName?: string;
  accentClassName?: string;
  descriptionClassName?: string;
}>;

export function SectionHeader({
  id,
  title,
  accent,
  description,
  actions,
  size = 'lg',
  titleClassName,
  accentClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h2
          id={id}
          className={cn(
            'text-h3 font-bold text-text-heading',
            size === 'lg' ? 'lg:text-h1-sm' : 'lg:text-h2-sm lg:font-bold',
            titleClassName,
          )}
        >
          {title} {accent !== undefined && <span className={cn('text-brand-primary', accentClassName)}>{accent}</span>}
        </h2>
        {description !== undefined && (
          <p
            className={cn(
              'mt-2 text-body-l text-text-body',
              size === 'lg' ? 'lg:mt-0' : 'lg:mt-2',
              descriptionClassName,
            )}
          >
            {description}
          </p>
        )}
      </div>
      {actions !== undefined && <div className="flex items-center gap-3 lg:pt-3">{actions}</div>}
    </div>
  );
}
