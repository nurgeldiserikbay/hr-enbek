import type { ReactNode } from 'react';

import { Link } from '@/shared/config';
import { cn, tv } from '@/shared/lib/styles';
import { ChevronLeft, ChevronRight } from '@/shared/ui/icon';

import { getPageItems } from './get-page-items.ts';

const pageVariants = tv({
  base: [
    'inline-flex size-10 items-center justify-center rounded-lg border text-body-m-medium transition-colors lg:size-11',
    '[&_svg]:size-4',
  ],
  variants: {
    state: {
      default: 'border-border-default bg-surface-card text-text-heading hover:border-border-strong',
      current: 'border-brand-primary bg-brand-primary text-brand-on-primary',
      disabled: 'border-border-default bg-surface-card text-text-muted',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

type PaginationProps = Readonly<{
  currentPage: number;
  pageCount: number;
  hrefForPage: (page: number) => string;
  label: string;
  previousLabel: string;
  nextLabel: string;
  pageLabel: (page: number) => string;
  className?: string;
}>;

export function Pagination({
  currentPage,
  pageCount,
  hrefForPage,
  label,
  previousLabel,
  nextLabel,
  pageLabel,
  className,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  const renderArrow = (page: number, arrowLabel: string, icon: ReactNode) =>
    page < 1 || page > pageCount ? (
      <span aria-hidden="true" className={pageVariants({ state: 'disabled' })}>
        {icon}
      </span>
    ) : (
      <Link href={hrefForPage(page)} aria-label={arrowLabel} className={pageVariants()}>
        {icon}
      </Link>
    );

  return (
    <nav aria-label={label} className={cn('flex', className)}>
      <ul className="flex items-center gap-2">
        <li>{renderArrow(currentPage - 1, previousLabel, <ChevronLeft />)}</li>
        {getPageItems(currentPage, pageCount).map((item) =>
          item.type === 'gap' ? (
            <li
              key={`gap-${String(item.after)}`}
              aria-hidden="true"
              className="w-3.25 text-center text-body-s text-text-muted"
            >
              …
            </li>
          ) : (
            <li key={item.page}>
              <Link
                href={hrefForPage(item.page)}
                aria-label={pageLabel(item.page)}
                aria-current={item.page === currentPage ? 'page' : undefined}
                className={pageVariants({ state: item.page === currentPage ? 'current' : 'default' })}
              >
                {item.page}
              </Link>
            </li>
          ),
        )}
        <li>{renderArrow(currentPage + 1, nextLabel, <ChevronRight />)}</li>
      </ul>
    </nav>
  );
}
